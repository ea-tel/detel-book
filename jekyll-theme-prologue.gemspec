# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-prologue"
  spec.version       = "0.3.2"
  spec.authors       = ["HTML5 UP", "Chris Bobbe"]
  spec.email         = ["csbobbe@gmail.com"]

  spec.summary       = %q{DETEL Textbook}
  spec.description   = "An Open Textbook for Doctoral Education of Technology-Enhanced Learning"
  spec.homepage      = "https://ea-tel.eu/detel-book/"
  spec.license       = "CC-BY-3.0"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|_config.yml|404.html|LICENSE|README)}i) }

  spec.add_development_dependency "jekyll", "~> 3.3"
  spec.add_development_dependency "bundler", "~> 2.1.4"
end
