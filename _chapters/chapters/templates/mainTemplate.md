---
layout: tutorial
title: The Main Template
hide: false
permalink: /chapter/templates/main-template/
---

# The Main Template
This chapter will serve as a comprehensive template for future chapters and contains several sections on important Markdown features that you can use, i.e. tables, images, bullet points and references to the bibliography and table of content.


## The Table of Contents {#tableOfContents}
In order for this page to be linked in the table of contents, please create a header as follows.

    ---
    layout: reading_chapter
    title: [The Title of the Chapter]
    hide: false
    permalink: /chapter/[topic name]/[chapter title]/
    ---
    
<sup>*Note, that the above code-block has been created by indenting the lines by 2 tabs.*</sup>

### Layout 
You can select one of several defined layouts for your chapter, that predominantly determine the icon at the start of your chapter. In the following you will find a breakdown on the layouts we would suggest for you and that can be found [here in the repository](/_layouts).

| Layout type           | Description                                                                    |  Icon                                                                    |
|---                    |---                                                                             |---                                                                       |
| `reading-chapter`     | This template is used for standard chapters, created for pure reading purposes.| ![The reading chapter icon](/assets/images/ReadingChapter.png)           |
| `tutorial`            | This template can be used for step-by-step tutorials such as for this chapter. | ![The tutorial icon](/assets/images/Tutorial.png)                        | 
| `programming-exercise`| This template is used for exercises and tutorials were the reader has to code. | ![The programming exercise icon](/assets/images/ProgrammingExercise.png) |

<sup>*Please refer to [this deployed chapter](https://ea-tel.github.io/detel-book/chapter/transversal/wellbeing/) to see an example for an reading chapter and the corresponding icon on the website.*</sup>

Apart from these layouts, a layout for posts is provided. This layout does not add an icon, yet requires some more attributes in the header that add a data and author to the post and should be used for blog posts only these are found [here in the repository](/_posts). For the layout `post`, please add the following header.

    ---
    layout: post
    title: [My Post Title]
    author: [My Name]
    date: [The Date]
    hide: false
    permalink: /post/[post title]/
    ---
    
<sup>*Please refer to [this deployed post](https://ea-tel.github.io/detel-book/2022/01/20/welcome.html) to see a blog post on the website.*</sup>

### Permalink 
Each chapter should be given a permalink which serves as an identifier for your chapter. Permalinks define the path on which the chapter will be found on the website **and can be different from its path in the repository**. This facilitates structuring your content. This permalink is crutial for linking your chapter in the table of content and should be of the form `/chapter/[topic name]/[chapter title]/` where `[topic name]` should be used to refer to the topic area of your chapter and `[topic name]` is used to identify the chapter based in its title.

For this template the permalink has been defined to be `permalink: /chapter/templates/main-template/` as it belongs to the subfolder and topic area "Templates" and should be identified as the main template. Observe, that this file is indeed in the subfolder "templates". Although this is not necessary, it proves helpful to structure the chapters in the repository in corresponding subfolders based on the topics that are to be addressed by the DE-TEL book such that navigating the repository is simplified.

### Linking in the Table of Contents
For adding a chapter to the table of contents, navigate to [the table of contents file in the repository](/tableOfContents.md) and add a subtopic to the corresponding main topic area as follows based on your permalink. Your chapter will then appear in the table of contents and be a clickable link to your chapter once the website is deployed. 
    
    ## Main Topic 

    1. [The Title of the Chapter](/detel-book[your permalink])
    
    
<sup>*Note, that this template has been added to the table of contents as well and can be used as an example for future chapters.*</sup>

#### Sub-chapters
If you have structured your chapter into multiple sub-chapters - as this chapter is - you are able to concretely refer to these sub-chapters as well and add them to the table of contents. This is not necessary by any means, but can allow readers to access certain parts of your chapter quicker if they so desire. This is done by adding a tag to the desired title or subtitle of the section in the shape of (#tag) (see for example the headline of this section `## The Table of Contents {#tableOfContents}`). By referencing this tag, the reader is automatically navigated to it. See the following example provided in the [table of contents file in the repository](/tableOfContents.md) where we reference sub-chapters by adding the tag to the permalink.

        ## Templates

        X. [The Main Template](/detel-book/chapter/templates/main-template/)
        1. [The Table of Contents](/detel-book/chapter/templates/main-template/#tableOfContents)
        2. [The Bibliography](/detel-book/chapter/templates/main-template/#bibliography)
        3. [The Chapter Design](/detel-book/chapter/templates/main-template/#chapterDesign)
        
        
You can also link these sub-chapters within your chapters creating cross-references. For example, your are currently reading the content of the [Table of Contents](#tableOfContents) section.


## The Bibliography {#Bibliography}
An important feature that you can use in your chapter is citing references that you have documented in a corresponding bibliography file. Doing this, the references will be generated automatically without you having to be concerned with adding and formatting the references in your own chapter similar to citing using latex. In the following, we will provide an example.

>"Chaos isn't a pit. Chaos is a ladder." {% cite GoT %}


<sup>*Note, that the above quote has been created using a ">" in front of the quoted line.*</sup>

Observe, that we cite a reference "GoT", which is defined in the bibliography file [here in the repository](/_bibliography/references.bib) as follows. While this is one example for a type of reference you can make, articles, books etc. can easily be referenced as well using different entry types as illustrated by [this BibTeX guide](https://www.bibtex.com/e/entry-types/). All references defined in this file will be listed under a separate bibliography section on the website as opposed to under your chapter. Note, that `{% cite GoT %}` will compile into `(Benioff, 2013)` once the chapter is deployed. In this case "GoT" is the identifier of the reference which we cite.

        @movie{GoT,
        title =   {Game of Thrones},
        producer= {Benioff, D. and Weiss, D. B.}     
        director = {Ramin Djawadi},
        year = {2013},
        }
        
<sup>*Please refer to [the deployed website section](https://ea-tel.github.io/detel-book/bibliography.html) to see how the references will be listed.*</sup>


## Chapter Design {#chapterDesign}
After setting up the core references between your chapter and the table of contents and the bibliography, you are able to enhance the appearance of your chapter with some suggested features.


