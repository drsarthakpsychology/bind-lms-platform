Pod::Spec.new do |s|
  s.name           = 'CaptureGuard'
  s.version        = '1.0.0'
  s.summary        = 'Tells the app when the iPhone screen is being recorded or mirrored.'
  s.author         = 'Vibha Psychology'
  s.homepage       = 'https://vibhapsychology.com'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.swift'
end
