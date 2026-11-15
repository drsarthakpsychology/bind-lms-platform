package expo.modules.pdfpages

import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.ParcelFileDescriptor
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream

/**
 * Draws the pages of a PDF on this phone with Android's own PdfRenderer, so a
 * lecture material can be read inside the app (where FLAG_SECURE blocks
 * screenshots) instead of being handed to another app. Pages become PNG
 * files in the app's private cache; the app deletes them when the reader closes.
 */
class PdfPagesModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PdfPages")

    AsyncFunction("pageCount") { path: String ->
      val renderer = open(path)
      try {
        renderer.pageCount
      } finally {
        renderer.close()
      }
    }

    AsyncFunction("renderPage") { path: String, index: Int, width: Int ->
      val cache = appContext.reactContext?.cacheDir ?: throw IllegalStateException("No cache folder")
      val renderer = open(path)
      try {
        val page = renderer.openPage(index)
        try {
          val w = width.coerceIn(200, 2400)
          val h = (w.toFloat() * page.height / page.width).toInt().coerceAtLeast(1)
          val bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
          bitmap.eraseColor(Color.WHITE)
          page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
          val out = File(cache, "pdfpages-${path.hashCode()}-$index-$w.png")
          FileOutputStream(out).use { stream -> bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream) }
          bitmap.recycle()
          mapOf("uri" to Uri.fromFile(out).toString(), "width" to w, "height" to h)
        } finally {
          page.close()
        }
      } finally {
        renderer.close()
      }
    }
  }

  private fun open(path: String): PdfRenderer {
    val file = File(Uri.parse(path).path ?: path)
    val descriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
    return PdfRenderer(descriptor)
  }
}
