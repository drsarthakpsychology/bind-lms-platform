Pod::Spec.new do |s|
  s.name           = 'PdfPages'
  s.version        = '1.0.0'
  s.summary        = 'Draws PDF pages to images so lecture materials are read inside the app.'
  s.author         = 'Vibha Psychology'
  s.homepage       = 'https://vibhapsychology.com'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.swift'
end
