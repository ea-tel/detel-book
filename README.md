# DE-TEL Book

![Jekyll Build & Deploy](https://github.com/ea-tel/detel-book/workflows/Jekyll%20Build%20&%20Deploy/badge.svg)

Welcome to the editing environment for the DE-TEL Book.

# HowTo Run Locally

## Prepare Development Environment

__Step 1.__ Install [Ruby](https://www.ruby-lang.org) on your machine ([Detailed instructions](https://jekyllrb.com/docs/installation/))

If you are going to install Ruby on a Windows machine, there is a convenient tool [RubyInstaller](https://rubyinstaller.org/downloads/).

Ruby version 2.7.5 is recommended to work with this repository.

__Step 2.__ Check that Ruby is successfully installed and can be accessed from the terminal / command line.
To do this, open the Command prompt and run command:
   
    ruby -v
   
It should return the installed version of Ruby.

__Step 3.__ Clone this DETEL book repository. If needed, use instructions of [how to clone a github repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository). Remember the folder where the local version of the repository is stored on your machine.


__Step 4.__ In the terminal/command line, navigate to the folder with the local version of the DETEL book repository. To navigate to the correct folder, use following command:

    cd

Example of how to use the cd command:

When you open Command Prompt, you see a line similar to this:

    C:\Users\username>

You can type these commands to navigate:
    
    C:\Users\username>cd Documents
    C:\Users\username\Documents>cd Github
    C:\Users\username\Documents\GitHub>cd detel-book

Now you are in this directory:

    C:\Users\username\Documents\GitHub\detel-book>

You can also type the entire path after cd:

        C:\Users\username> cd C:\Users\username\Documents\GitHub\detel-book

__Step 5.__ Install bundler

Run the following colland:

    gem install bundler

__Step 6.__ Use bundler to pull Jekyll

Run the following commands:

    bundle install
    
    bundle update

## Build & Serve Locally

First, please change the _config.yml "url" parameter to "http://localhost:4000".

Please do not commit this change!
Now build the page locally with the following command:

    bundle exec jekyll serve

 Navigate your browser to `http://localhost:4000/detel-book/` to check results while you develop.

## How to branch and create a pull request 

Now when you have the writing environment setup locally, you can start creating new or change existing content. We recommend that you work on one piece at a time, as it will be easier to review your contribution. Please, follow this process:

__Step 1.__ In GitBash, navigate to the folder with the local version of the DETEL book repository.

You should  notice that Gitbash displayed the name of your current branch in brachets after the name of the directory. It is (master) by default.

__Step 2.__ Create a new branch

    $ git checkout -b "MyNewBranch"

You should now notice that GitBash has switched to your new branch.

__Step 3.__ Edit!

Now you can create, edit or delete any content of the book. For example, you if you want to create a new chapter, you can create a new file and start editing it. You can use any text editr, like a Notepad app, to edit the file. However, we recommend that you install and use [VS Code](https://code.visualstudio.com/) app. This app is free and has several convenient tools in addition to editing the text itself.

The content of the book is written in Markdown, a simple markup language. To get started with Markdown, check this [starting guide](https://www.markdownguide.org/getting-started/) and this [cheat sheet](https://www.markdownguide.org/cheat-sheet/).

__Step 4.__ Submit your edits for review

After you have made a set of edits, you need to run the following commands in GitBash to submit your changes for review in the online repository:

Add all your changes to the submission:

    $ git add -A

Create a commit:

    $ git commit -m "Short human-readable description of the changes I made should be written here"

Send the commit to the online repository:

    $ git push

__Step 5.__ Wait for review

Now you can wait for one of our administrators to check your contribution and accept or reject it. As soon as it is accepted, the contents of your commit will appear online on the public website. While you are waiting for the review, feel free to work on the next set of edits (e.g., your next chapter).

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

The project's [wiki](https://github.com/ea-tel/detel-book/wiki) contains further details about the contribution guidelines and the technical environment.