task :package do
  files = [
    'background.html',
    'background.js',
    'build.js',
    'icon16.png',
    'icon48.png',
    'icon128.png',
    'jquery.js',
    'manifest.json',
    'script.js',
    'lib',
    'lib/require.js',
    'lib/underscore-min.js',
    'lib/zepto-min.js'
  ]
  filelist = files.join(" ")
  %x[zip package.zip #{filelist}]
end

task :default => :package
