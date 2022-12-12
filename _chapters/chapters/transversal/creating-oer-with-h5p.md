---
layout: tutorial
title: Creating Open Educational Resources with the H5P tool
authors: <br>Lorena Sousa, University of Aveiro, Portugal <br>Luís Pedro, University of Aveiro, Portugal <br>Carlos Santos, University of Aveiro, Portugal
hide: true
permalink: /chapter/transversal/creating-oer-with-the-H5P-tool/
---

**Abstract:** Open Educational Resources are any teaching, learning or research materials that are under open licences or reside in the public domain, free of copyright restrictions, giving users free permission to engage in the 5R activities (retain, reuse, revise, remix, and redistribute). Applying open licences that legally enable users to engage in these 5R activities as well as tools that facilitate the technical openness of the content are two aspects that must be taken into consideration when developing OER. One example of a tool is the H5P (an abbreviation for HTML5 Package), which is an open-source and free to use tool that enables anyone to create, share and reuse interactive HTML5 content without the need for any technical skills. With H5P, users can create several content types such as videos enriched with interactions, presentations with interactive slides, interactive books, and quizzes with various question types. The main goals of this chapter are to introduce some key concepts of OER, present the H5P tool, and show how these key concepts can be applied and explored with the H5P tool.

## Introduction
As information technologies have advanced and been more accessible, a vast number of digital resources have become more available for those involved in education. Teachers have been using the Internet to spread their materials and courses, and content in digital format has largely increased. Yet, most of these materials are not open to being freely reused, shared, or remixed. 

With the purpose of overcoming these barriers, the Open Educational Resource (OER) movement was founded to encourage and enable anyone to reuse and share content in an open manner. However, educators from higher education institutions are still resistant to embracing the use of OER. Besides, there is a lack of technical skills to select and remix OER appropriately and a lack of awareness regarding copyright issues among academics. 

The main goals of this chapter are to introduce some key concepts of OER, present the H5P tool, and show how these key concepts can be applied and explored with the H5P tool. This chapter is organized into four sections. In the first section, some OER definitions are presented. Then, there is a discussion about the legal and technical openness of OER; and, finally, the H5P tool is introduced and the OER concepts are discussed considering its functionalities.

## OER Definitions
 
#### OECD (Organization for Economic Co-operation and Development) {% cite OECD %}
> “The definition of OER currently most often used is “digitised materials offered freely and openly for educators, students and self-learners to use and reuse for teaching, learning and research”. OER includes learning content, software tools to develop, use and distribute content, and implementation resources such as open licences.”
		
#### [UNESCO](https://webarchive.unesco.org/20160807000909/http://www.unesco.org/new/en/communication-and-information/events/calendar-of-events/events-websites/world-open-educational-resources-congress)
> “teaching, learning and research materials in any medium, digital or otherwise, that reside in the public domain or have been released under an open licence that permits no-cost access, use, adaptation and redistribution by others with no or limited restrictions.”
	
#### [The Cape Town Open Education Declaration](https://www.capetowndeclaration.org/read/)
> "Open educational resources should be freely shared through open licences which facilitate use, revision, translation, improvement and sharing by anyone. Resources should be published in formats that facilitate both use and editing, and that accommodate a diversity of technical platforms. Whenever possible, they should also be available in formats that are accessible to people with disabilities and people who do not yet have access to the Internet.”
 
#### [The Wikieducator OER Handbook](https://wikieducator.org/OER_Handbook/educator_version_one)
> “The term "Open Educational Resource(s)" (OER) refers to educational resources (lesson plans, quizzes, syllabi, instructional modules, simulations, etc.) that are freely available for use, reuse, adaptation, and sharing.”
 
#### [OER Commons](https://www.oercommons.org/about#about-open-educational-resources)
> “Open Educational Resources (OER) are teaching and learning materials that you may freely use and reuse at no cost, and without needing to ask permission. Unlike copyrighted resources, OER have been authored or created by an individual or organization that chooses to retain few, if any, ownership rights.”
 
#### [The William and Flora Hewlett Foundation](https://hewlett.org/open-educational-resources-breaking-the-lockbox-on-education/)
> “The idea behind Open Educational Resources (OER) is simple but powerful—educational materials made freely and legally available on the Internet for anyone to reuse, revise, remix and redistribute. These digital materials have the potential to give people everywhere equal access to our collective knowledge and provide many more people around the world with access to quality education by making lectures, books and curricula widely available on the Internet for little or no cost.” 
 
#### [David Wiley](http://opencontent.org/definition/)
The terms "open content" and "open educational resources" describe any work (traditionally excluding software, which is described by other terms like "open source") that is either (1) in the public domain or (2) licenced in a manner that provides everyone with free and perpetual permission to engage in the 5R activities:
1. *Retain* - make, own, and control a copy of the resource (e.g., download and keep your own copy)
2. *Revise* - edit, adapt, and modify your copy of the resource (e.g., translate into another language)
3. *Remix* - combine your original or revised copy of the resource with other existing material to create something new (e.g., make a mash-up)
4. *Reuse* - use your original, revised, or remixed copy of the resource publicly (e.g., on a website, in a presentation, in a class)
5. *Redistribute* - share copies of your original, revised, or remixed copy of the resource with others (e.g., post a copy online or give one to a friend)

## Legal openness: Open Licences
According to [Wiley](http://opencontent.org/definition), content is open not only when it is freely available to be used in other contexts, but also when it gives everyone permission to engage with the material through these 5R activities. In other words, neither all educational resources that are free are also open to being remixed and redistributed. Most of them are under copyright protection and, because of this, it is necessary to use open licences to enable their adaptation and sharing. 

While traditional “all rights reserved” copyright is automatic and restricts access, open licences allow the authors to concede specific permissions on how they want their property to be used. Although there are other open licences such as the Open Publication Licence and GNU Free Documentation Licence, the most frequently used licences are the Creative Commons (CC) {% cite Aaron %}, {% cite Wiley %}.

CC licences offer a “some rights reserved” approach that grants the public permission to use the resources in a more flexible way, under a spectrum of concessions that answer the question of how these resources can be utilized {% cite Bissell %}. These licences consist of four components, Attribution (BY), Share Alike (SA), Non-commercial (NC), and No Derivatives Works (ND), and are defined as follows (Figure 1):

<figure>
    <img src="https://user-images.githubusercontent.com/100372892/168425826-64025832-94a7-4ea8-a9a3-ec829c3d7d7f.JPG" alt="Internal Image"">
    <figcaption>Figure 1 - Creative Commons components as documented on [the CC website](https://creativecommons.org/licences/?lang=en).</figcaption>
</figure>

When combined, these components can generate six different licence types, which are listed below from most to least permissive in Figure 2:

<figure>
    <img src="https://user-images.githubusercontent.com/100372892/168425870-76d3b602-a305-493f-9dfa-5498988c1147.JPG" alt="Internal Image"">
    <figcaption>Figure 2 - Creative Commons licence types as documented on [the CC website](https://creativecommons.org/about/cclicences/).</figcaption>
</figure>

The less restrictive is the licence, the better it can benefit both the creators and the users {% cite Bissell %}. There is also the “no copyright reserved” option in the CC components, known as CC0, that “allows creators to give up their copyright and put their works into the worldwide public domain” as taken from [the CC website](https://creativecommons.org/licences/?lang=en). However, the most popular licences for OER encompass BY, BY-SA, and BY-NC-SA {% cite Wiley %}. As the NoDerivatives component does not permit individuals to make changes or adaptations to the resources, and revising and remixing are activities that belong to OER definition, the licences containing the NoDerivatives element are not included in the discussion of OER {% cite Wiley %}.

There are also some concerns about the ShareAlike component. According to Hilton et al. {% cite Aaron %}, sharing adaptations under the same licence as the original is a challenging situation for those who want to remix OER. Besides, the Non-Commercial component is also problematic, since it is not clear if a material licenced under this component can be used in a course where students are charged a fee. Therefore, if you want to make your resource as free as possible, the Attribution licence is the most open option.

## Technical openness: the ALMS Framework
In addition to legal considerations related to licensing, there are also some technical issues that affect openness. If people are given permission to interact with OER through the 5R activities, they should also be given technical tools to unlock the material so that they can revise and remix it according to their needs {% cite Aaron %}. The ALMS analysis is a framework developed by [Wiley](http://opencontent.org/definition/) and helps thinking about these technical aspects. ALMS is an acronym for: 

* Access to editing tools: people must have access to software that enables them to edit the resource, not only open and visualize it.
* Level of expertise required to revise or remix: the tools used to develop the OER must be simple and easy to use. 
* Meaningfully editable: the OER produced must be shared in such a format that enables people to edit it.
* Source-file access: a source file is accessible when the file that the web developer edits and works with is the same that the web browser displays and the user interacts with (e.g., an HTML file). Consequently, modifying it must be uncomplicated.  

Applying open licences which permit users to engage with materials through the 5R activities as well as applying the ALMS analysis framework that enables and facilitates technical openness are two aspects that must be taken into consideration in order to maximize the openness of content according to [Wiley](http://opencontent.org/definition/) and {% cite Aaron %}. One example of an easy-to-use tool to develop OER is the H5P tool.

## H5P tool
[H5P](https://h5p.org/)[^1] (an abbreviation for HTML5 Package) is an open-source and free to use tool that enables anyone to create, share and reuse interactive HTML5 content without the need for any technical skills. H5P makes it easy to create rich interactive content by providing several content types for various needs, such as videos enriched with interactions, presentations with interactive slides, interactive books integrating several content types, drag and drop tasks with images and text, images with multiple information hotspots, quizzes with various question types, and many others. Visit [their website](https://h5p.org/content-types-and-applications) for more examples. 

Sousa et al. {% cite Sousa %} developed an OER [prototype about Design-based Research](https://h5p.org/node/1265482) for doctoral programs in Technology-Enhanced Learning using the H5P tool. The content type adopted was the interactive book because it allows authors to combine other interactive content types, like interactive videos, presentations, and quizzes, through multiple pages. 

Figure 3 shows an example of the content type called drag the words, where it is possible to create text-based drag and drop tasks. In this activity, learners are asked to drag the characteristics of design-based research and drop them into the correct explanation. Then, they can check their answers to see how many responses they got right and, based on the right answers, a score is generated. They can also choose between retrying the task or visualizing its solution. Figure 3, for instance, presents the solution with the correct responses.

<figure>
    <img src="https://user-images.githubusercontent.com/100372892/168425976-1adaedf7-cede-4e71-8436-632bac0814f3.JPG" alt="Internal Image">
    <figcaption>Figure 3 - Example of the content type called drag the words (source: Sousa et al.).</figcaption>
</figure>

Figure 3 illustrates a part of the page about the Characteristics of design-based research. On the left-hand side of the image, it is possible to visualize the contents of this interactive book. The numbers in the top right-hand corner of the image indicate the actual page and the total pages of the book, respectively. 

At the end of the interactive book, there is a report displaying the learner’s progress throughout the book (Figure 4). There is the total score, which is the number of points scored by the learner from his/her correct answers to the interactive questions; the book progress, which is the percentage of the visualized pages and the performed interactions with the content (it is not possible to get 100% of book progress only visualizing the pages); and the interactions progress, which is the percentage of the content that the learner interacted with. Still on this last page, there is also a summary below this report that shows the details of the interactions from each page.

<figure>
    <img src="https://user-images.githubusercontent.com/100372892/168426050-a2b1c9c7-945b-4652-882b-3e457a22ceaf.JPG" alt="Internal Image">
    <figcaption>Figure 4 - Summary of an interactive book (source: Sousa et al.).</figcaption>
</figure>

According to the [H5P website](https://h5p.org/integrations), there are three types of H5P integrations. The first one is to create and store the content on H5P.com, and access it through a direct link or embed the content in any platform that supports embedded content (iframes). The second possibility is via LTI integration with existing publishing systems, like Canvas, Brightspace, Blackboard, and Moodle. And the third one is via H5P plugins made for WordPress, Moodle, and Drupal, for example.

At the bottom of the page, there is a button (Figure 5) that permits the users to reuse the material. It is possible to download the content, upload it to the users’ own account, and make whatever alterations or adaptations they need. In other words, with the H5P tool, the users can engage in the 5R activities that were proposed by [David Wiley](http://opencontent.org/definition/). 

<figure>
    <img src="https://user-images.githubusercontent.com/100372892/168426072-0f675316-1178-4638-84a6-60c81101c318.JPG" alt="Internal Image">
    <figcaption>Figure 5 - H5P Reuse button.</figcaption>
</figure>

## Conclusions
In short, OER are materials in any medium, legally and technically, available to educators and learners in a format that facilitates its reuse and adaptation. The open licences are legal statements that give users permission to interact with the resource through the 5R activities. In a complementary way, the ALMS framework discusses the aspects that materials should have in order to be technically open. One example of a tool that facilitates this technical openness is the H5P tool. With this tool, users can retain, reuse and adapt the content according to their context. 

 
[^1]: Alternatively: [https://h5p.com/](https://h5p.com/)



