import ExpoModulesCore
import UIKit

/// iPhone only: is the screen being recorded, mirrored or shown on AirPlay?
/// Sends "onChange" whenever that changes. Android needs none of this:
/// FLAG_SECURE (expo-screen-capture) already blanks recordings there.
public class CaptureGuardModule: Module {
  private var observer: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("CaptureGuard")
    Events("onChange")

    Function("isCaptured") { () -> Bool in
      return UIScreen.main.isCaptured
    }

    OnStartObserving {
      self.observer = NotificationCenter.default.addObserver(forName: UIScreen.capturedDidChangeNotification, object: nil, queue: .main) { [weak self] _ in
        self?.sendEvent("onChange", ["captured": UIScreen.main.isCaptured])
      }
    }

    OnStopObserving {
      if let o = self.observer { NotificationCenter.default.removeObserver(o) }
      self.observer = nil
    }
  }
}
