package expo.modules.systembars

import android.os.Build
import android.view.OrientationEventListener
import android.view.View
import android.view.Window
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * - Keeps the Android navigation bar (the back, home and recents buttons, or the
 *   gesture line) readable when the student picks Light or Dark in Settings and
 *   the phone is set the other way. The status bar is handled by expo-status-bar.
 * - Full-screen lectures: hides the status and navigation bars (a swipe from
 *   the edge shows them for a moment) and lets the video run under a camera cutout.
 * - Tells the lecture player which way the phone is physically held, even while
 *   the screen is locked to one side, so leaving full screen with the button never
 *   turns the screen straight back (the player re-allows turning once the phone is upright).
 */
class SystemBarsModule : Module() {
  private var tilt: OrientationEventListener? = null
  /** 0 unknown, 1 upright, 2 on its side. */
  private var held = 0
  private var cutoutBefore: Int? = null

  override fun definition() = ModuleDefinition {
    Name("SystemBars")

    Events("onTilt")

    AsyncFunction("setNavigationBarDark") { dark: Boolean ->
      val window = appContext.currentActivity?.window
      if (window != null) apply(window, dark)
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("setImmersive") { on: Boolean ->
      val window = appContext.currentActivity?.window
      if (window != null) immersive(window, on)
    }.runOnQueue(Queues.MAIN)

    /** Starts the tilt events. False when the phone has no orientation sensor. */
    AsyncFunction<Boolean>("startTilt") {
      val ctx = appContext.reactContext ?: return@AsyncFunction false
      val listener = tilt ?: object : OrientationEventListener(ctx) {
        override fun onOrientationChanged(deg: Int) {
          if (deg == ORIENTATION_UNKNOWN) return
          // Wide dead zones between the two, so a phone held at an angle does not flip back and forth.
          val now = when {
            deg <= 25 || deg >= 335 || deg in 155..205 -> 1
            deg in 65..115 || deg in 245..295 -> 2
            else -> return
          }
          if (now != held) {
            held = now
            sendEvent("onTilt", mapOf("landscape" to (now == 2)))
          }
        }
      }.also { tilt = it }
      if (!listener.canDetectOrientation()) return@AsyncFunction false
      held = 0
      listener.enable()
      true
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("stopTilt") {
      tilt?.disable()
      held = 0
    }.runOnQueue(Queues.MAIN)

    OnDestroy {
      tilt?.disable()
      tilt = null
    }
  }

  @Suppress("DEPRECATION")
  private fun apply(window: Window, dark: Boolean) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val flag = WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
      window.insetsController?.setSystemBarsAppearance(if (dark) 0 else flag, flag)
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val flags = window.decorView.systemUiVisibility
      window.decorView.systemUiVisibility =
        if (dark) flags and View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR.inv() else flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
    }
  }

  @Suppress("DEPRECATION")
  private fun immersive(window: Window, on: Boolean) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      val attrs = window.attributes
      if (on) {
        if (cutoutBefore == null) cutoutBefore = attrs.layoutInDisplayCutoutMode
        attrs.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
      } else {
        cutoutBefore?.let { attrs.layoutInDisplayCutoutMode = it }
        cutoutBefore = null
      }
      window.attributes = attrs
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val c = window.insetsController ?: return
      if (on) {
        c.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        c.hide(WindowInsets.Type.systemBars())
      } else {
        c.show(WindowInsets.Type.systemBars())
      }
    } else {
      val hide = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
      val layout = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
      val flags = window.decorView.systemUiVisibility
      window.decorView.systemUiVisibility = if (on) flags or hide or layout else flags and hide.inv()
    }
  }
}
