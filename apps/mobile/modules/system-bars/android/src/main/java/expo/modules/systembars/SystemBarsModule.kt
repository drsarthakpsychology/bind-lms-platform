package expo.modules.systembars

import android.os.Build
import android.view.View
import android.view.Window
import android.view.WindowInsetsController
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Keeps the Android navigation bar (the back, home and recents buttons, or the
 * gesture line) readable when the student picks Light or Dark in Settings and
 * the phone is set the other way. The status bar is handled by expo-status-bar.
 */
class SystemBarsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SystemBars")

    AsyncFunction("setNavigationBarDark") { dark: Boolean ->
      val window = appContext.currentActivity?.window
      if (window != null) apply(window, dark)
    }.runOnQueue(Queues.MAIN)
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
}
