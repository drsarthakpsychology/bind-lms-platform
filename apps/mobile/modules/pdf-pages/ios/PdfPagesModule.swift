import ExpoModulesCore
import PDFKit
import UIKit

/// iPhone side of the in-app PDF reader: page count, and one page drawn to a PNG in the cache.
public class PdfPagesModule: Module {
  public func definition() -> ModuleDefinition {
    Name("PdfPages")

    AsyncFunction("pageCount") { (path: String) -> Int in
      guard let doc = PDFDocument(url: Self.url(path)) else { throw Exception(name: "pdf", description: "Could not open the PDF") }
      return doc.pageCount
    }

    AsyncFunction("renderPage") { (path: String, index: Int, width: Int) -> [String: Any] in
      guard let doc = PDFDocument(url: Self.url(path)), let page = doc.page(at: index) else { throw Exception(name: "pdf", description: "Could not open the page") }
      let box = page.bounds(for: .mediaBox)
      let w = CGFloat(min(max(width, 200), 2400))
      let h = max(1, (w * box.height / box.width).rounded())
      let image = page.thumbnail(of: CGSize(width: w, height: h), for: .mediaBox)
      let out = FileManager.default.temporaryDirectory.appendingPathComponent("pdfpages-\(path.hashValue)-\(index)-\(Int(w)).png")
      try image.pngData()?.write(to: out)
      return ["uri": out.absoluteString, "width": Int(w), "height": Int(h)]
    }
  }

  private static func url(_ path: String) -> URL {
    return URL(string: path) ?? URL(fileURLWithPath: path)
  }
}
