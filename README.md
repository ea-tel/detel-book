# DE-TEL Book

![Jekyll Build & Deploy](https://github.com/ec-tel/detel-book/workflows/Jekyll%20Build%20&%20Deploy/badge.svg)

Welcome to the editing environment for the DE-TEL Book.

# HowTo Run Locally

## Prepare Development Environment

1. Install [Ruby](https://www.ruby-lang.org) on your machine ([Detailed instructions](https://jekyllrb.com/docs/installation/))

2. Clone this repository and open a terminal / command line

   Check that Ruby is successfully installed and can be accessed from the terminal / command line.
   To do this, run the command "ruby -v".
   It should return the installed version of Ruby.

3. In the terminal/command line, navigate to your main project folder

4. Install bundler

    gem install bundler

5. Use bundler to pull Jekyll

    bundle install
    
    bundle update

## Build & Serve Locally

First, please change the _config.yml "url" parameter to "http://localhost:4000".

Please do not commit this change!
Now build the page locally with

    bundle exec jekyll serve

 Navigate your browser to `http://localhost:4000/detel-book/` to check results while you develop.

# Description



# Scope

# Contents



# Contribution Model and Technical Infrastructure

The book project follows an agile approach differing from the classic development process typical for printed content.
Contributors can play several different roles in the production process.
We are looking for authors, reviewers, agile editors, designers, software developers, visual artists, and testers.
Agile teams are responsible for the generation of chapters and act as product owners. 

* Reviewers will review chapters and communicate with the author teams. 
* Team champions drive forward the agile development of chapters. 
* Designers lay-out the online book and printed versions. 
* Software developers are responsible for interactive Web graphics, application examples, exercises and other dynamic code. 
* Visual artists are responsible for appealing visualizations. 
* Testers will thoroughly try out the final versions of the book.

The book uses Git for version management and a GitHub organization for the creation, hosting, and delivery of the book contents to guarantee agile development.
We use the GitHub-based issue tracking system for the communication between the community members, such as the the authors and the reviewers.
Based on this content sharing and version management platform we use the static site generator Jekyll for rendering the content of the Git repository into a Web site.
With every commit, a new version of the Web site is created automatically.
Formatting of the content is done using a simple markdown language.
Programming and lay-out uses JavaScript and CSS.

The project's [wiki](https://github.com/ec-tel/detel-book/wiki) contains further details about the contribution guidelines and the technical environment.