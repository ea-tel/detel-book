---
layout: tutorial
title: The Main Template
hide: true
permalink: /chapter/templates/main-template/
---

# The Main Template
This chapter will serve as a comprehensive template for future chapters and contains several sections on important Markdown features that you can use, i.e. tables, images, bullet points and references to the bibliography and table of content.


## The Table of Contents {#tableOfContents}
In order for this page to be linked in the table of contents, please create a header as follows.

    ---
    layout: reading_chapter
    title: [The Title of the Chapter]
    hide: true
    permalink: /chapter/[topic name]/[chapter title]/
    ---
    
<sup>*Note, that the above code-block has been created by indenting the lines by 2 tabs.*</sup>

### Layout 
You can select one of several defined layouts for your chapter, that predominantly determine the icon at the start of your chapter. In the following you will find a breakdown on the layouts we would suggest for you and that can be found [here in the repository](/detel-book/_layouts).

| Layout type           | Description                                                                    |  Icon                                                                    |
|---                    |---                                                                             |---                                                                       |
| `reading-chapter`     | This template is used for standard chapters, created for pure reading purposes.| ![The reading chapter icon](/detel-book/assets/images/ReadingChapter.png)           |
| `tutorial`            | This template can be used for step-by-step tutorials such as for this chapter. | ![The tutorial icon](/detel-book/assets/images/Tutorial.png)                        | 
| `programming-exercise`| This template is used for exercises and tutorials were the reader has to code. | ![The programming exercise icon](/detel-book/assets/images/ProgrammingExercise.png) |

<sup>*Please refer to [this deployed chapter](https://ea-tel.github.io/detel-book/chapter/transversal/wellbeing/) to see an example for a reading chapter and the corresponding icon on the website.*</sup>

Apart from these layouts, a layout for posts is provided. This layout does not add an icon, yet requires some more attributes in the header that add a date and author to the post and should be used for blog posts only. These are found [here in the 




ory](/detel-book/_posts). For the layout `post`, please add the following header.

    ---
    layout: post
    title: [My Post Title]
    author: [My Name]
    date: [The Date]
    hide: true
    permalink: /post/[post title]/
    ---
    
<sup>*Please refer to [this deployed post](https://ea-tel.github.io/detel-book/2022/01/20/welcome.html) to see a blog post on the website.*</sup>

### Hide
The parameter hide should always be set to true. This means that it is hidden from the sidebar of the website once built. If set to false, all chapters with this setting will appear in the sidebar and overflow it with links. Thus, this should be avoided. However, the chapter will still be accessible of course by selecting it in the table of contents even if hide is set to true.

### Permalink 
Each chapter should be given a permalink which serves as an identifier for your chapter. Permalinks define the path on which the chapter will be found on the website **and can be different from its path in the repository**. This facilitates structuring your content. This permalink is crutial for linking your chapter in the table of content and should be of the form `/chapter/[topic name]/[chapter title]/` where `[topic name]` should be used to refer to the topic area of your chapter and `[chapter title]` is used to identify the chapter based in its title.

For this template the permalink has been defined to be `permalink: /chapter/templates/main-template/` as it belongs to the subfolder and topic area "Templates" and should be identified as the main template. Observe, that this file is indeed in the subfolder "templates". Although this is not necessary, it proves helpful to structure the chapters in the repository in corresponding subfolders based on the topics that are to be addressed by the DE-TEL book such that navigating the repository is simplified.

### Linking in the Table of Contents
For adding a chapter to the table of contents, navigate to [the table of contents file in the repository](/detel-book/tableOfContents.md) and add a subtopic to the corresponding main topic area based on your permalink as follows. Your chapter will then appear in the table of contents and be a clickable link to your chapter once the website is deployed. 
    
    ## Main Topic 

    1. [The Title of the Chapter](/detel-book[your permalink])
    
    
<sup>*Note, that this template has been added to the table of contents as well and can be used as an example for future chapters.*</sup>

#### Sub-chapters
If you have structured your chapter into multiple sub-chapters - as this chapter is - you are able to specifically refer to these sub-chapters as well and add them to the table of contents. This is not necessary by any means, but can allow readers to access certain parts of your chapter quicker if they so desire. This is done by adding a tag to the desired title or subtitle of the section in the shape of (#tag) (see for example the headline of this section `## The Table of Contents {#tableOfContents}`). By referencing this tag, the reader is automatically navigated to it. See the following example provided in the [table of contents file in the repository](/detel-book/tableOfContents.md) where we reference sub-chapters by adding the tag to the permalink.

        ## Templates

        X. [The Main Template](/detel-book/chapter/templates/main-template/)
        1. [The Table of Contents](/detel-book/chapter/templates/main-template/#tableOfContents)
        2. [The Bibliography](/detel-book/chapter/templates/main-template/#bibliography)
        3. [The Chapter Design](/detel-book/chapter/templates/main-template/#chapterDesign)
        
        
You can also link these sub-chapters within your chapters creating cross-references. For example, you are currently reading the content of the [Table of Contents](#tableOfContents) section. These references are generated upon deployment and do not work while browsing the repository.


## The Bibliography {#bibliography}
An important feature that you can use in your chapter is citing references that you have documented in a corresponding bibliography file. Doing this, the references will be generated automatically in a similar way to citing using latex, such that you don't have to be concerned about adding and formatting the references in your own chapter. In the following, we will provide an example.

>"Chaos isn't a pit. Chaos is a ladder." {% cite GoT %}


<sup>*Note, that the above quote has been created using a ">" in front of the quoted line.*</sup>

Observe, that we cite a reference "GoT", which is defined in the bibliography file [here in the repository](/detel-book/_bibliography/references.bib) as follows. While this is one example for a type of reference you can make, articles, books etc. can easily be referenced as well using different entry types as illustrated by [this BibTeX guide](https://www.bibtex.com/e/entry-types/). All references defined in this file will be listed under a separate bibliography section on the website as opposed to under your chapter. Note, that `{% cite GoT %}` will compile into `(Sakharov, 2013)` once the chapter is deployed. In this case "GoT" is the identifier of the reference which we cite.

        @movie{GoT,
        title =   {Game of Thrones},
        producer= {Benioff, D. and Weiss, D. B.},
        director = {Alik Sakharov},
        year = {2013},
        }
        
<sup>*Please refer to [the deployed website section](https://ea-tel.github.io/detel-book/bibliography.html) to see how the references will be listed.*</sup>


## Chapter Design {#chapterDesign}
After setting up the core references between your chapter and the table of contents and the bibliography, you are able to enhance the appearance of your chapter with some suggested features.

These include font styles such as ~~striked through text~~, **bold text**, *cursive text*, ***bold and cursive text*** and headings of different sizes.
 ### Heading 3
 #### Heading 4
 ##### Heading 5
 ###### Heading 6
 
 ---
 
 You can also add listings that can be numbered and nested in each other. Furthermore, task lists can be created and ticked.
  
 1. This is my first numbered item.
    * This is my first unnumbered item.
    * This is my second unnumbered item.
    * This is my third unnumbered item.
 2. This is my second numbered item.
 3. This is my third numbered item.

- [x] ToDo 1
- [ ] ToDo 2
- [ ] ToDo 3

---

Code blocks can be created as follows, it is even possible to specify the language which results in the code being colored accordingly.

```c#
Console.WriteLine("Hello World!");
```

```json
{
"type": "chapter",
"title": "The Main Template"
}
```
---
Tables can be generated [on this site](https://www.tablesgenerator.com/) and improved by defining the text alignment of the individual columns.

| Left Aligned | Center Aligned | Right Aligned |
| :---         |    :----:      |          ---: |
| text         | text           | text          |

---
You can link external resources as well as other chapters as follows.

[External Link (Resource from outside the project)](https://stackoverflow.com/questions/44610355/how-to-create-horizontal-line-in-markdown-using-hexo-framework)


[Internal Link (Resource from inside the project)](../_chapters/chapters/introduction/preface.md)


![External Image (Resource from outside the project)](https://t3.ftcdn.net/jpg/03/15/34/90/360_F_315349043_6ohfFyx37AFusCKZtGQtJR0jqUxhb25Y.jpg)


![Internal Image (Resource from inside the project)]({{pathToRoot}}/assets/images/Cover.png)


--- 

These images are very large. Another option of including images lets you set the size in pixels. Aligning text and images either center or right is also possible using the tag `<p align="center"> your text </p>`. This is illustrated in the following.

<p align="center">
<img src="{{pathToRoot}}/assets/images/Cover.png" alt="External Image" width="100px">
 <br>   I want this image to be aligned to the left.
</p>

<p align="right">
And this text should align to the right.
</p>

<p align="cleft">
<img src="https://t3.ftcdn.net/jpg/03/15/34/90/360_F_315349043_6ohfFyx37AFusCKZtGQtJR0jqUxhb25Y.jpg" alt="External Image" width="300px">
 <br>   I want this image to be centered.
</p>

<sup>*Note, that the same approaches can be used for linking videos.*</sup>

---
Finally, footnotes are possible to[^1] [^bignote].

[^1]: This is a one-line footnote.

[^bignote]: Larger footnotes over multiple lines are also possible.

    As we can see by this example. This line must be indented.
