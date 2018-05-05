require 'date'

desc 'create a new draft post'
task :post do
  title = ENV['TITLE']
  slug = "#{Date.today}-#{title.downcase.gsub(/[^\w]+/, '-')}"

  file = File.join(
    File.dirname(__FILE__),
    '_posts',
    slug + '.markdown'
    )

  File.open(file, "w") do |f|
    f << <<-EOS.gsub(/^    /, '')
    ---
    layout: post
    title: #{title}
    published: false
    categories:
    ---

    EOS
  end
end

desc 'List all draft posts'
task :drafts do
  puts `find ./_posts -type f -exec grep -H 'published: false' {} \\;`
end


def resize name, w, h
  sh %{mogrify -resize #{MAX_GEOMETRY[:w]}x#{MAX_GEOMETRY[:h]} '#{name}'}
end

MAX_GEOMETRY = { w: 1280.0, h: 960.0 }
namespace :images do

  task :list do
    @jpgs = Dir.glob("**/*.jpg") - Dir.glob("_site/**/*.jpg")
    @pngs = Dir.glob("**/*.png") - Dir.glob("_site/**/*.png")
    @images = @jpgs + @pngs
    puts @images
  end

  desc "Scale down images to max geometry allowed"
  task :resize => :list do
    files= { }

    @images.each do |jpg|
      IO.popen "identify '#{jpg}'" do |p|
        f = p.read
        name,bla,size = f.split(/ /)
        name.sub!(/jpg\[\d+\]$/, 'jpg')
        w,h = size.split('x').map(&:to_i)
        next unless name && w && h
        resize(name, w, h) if w > MAX_GEOMETRY[:w] || h > MAX_GEOMETRY[:h]
      end
    end
  end

  desc "Compress images"
  task :minimize => :list do

    @jpgs.each do |f|
      sh "jpegoptim --strip-all --totals -o '#{f}'"
    end

    @pngs.each do |png|
      before = File.size png
      sh "pngcrush -rem allb -reduce -brute -ow #{png}"
      puts "#{png} : #{before - File.size(png)} bytes smaller "
    end
  end
end
