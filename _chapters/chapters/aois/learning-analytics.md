---
layout: reading_chapter
title: A Gentle Introduction to Learning Analytics
authors: <br>Luis P. Prieto, Tallinn University, Estonia
hide: true
permalink: /chapter/aois/learning-analytics/
---


**Abstract:** This chapter provides an overview of learning analytics as a research field, for doctoral students who may not have a technical background. After describing learning analytics and its typical purposes, you will learn about example learning analytics tools and the settings you could use them in. Aside from this beginner-friendly introduction, the chapter provides additional resources later exploration.

## Expected outcomes

After reading this chapter and doing the proposed exercises, we hope you will:
* … be able to define learning analytics (LA) in your own words.
* … understand what kinds of learning analytics solutions are possible  (i.e., what is the design space of LA)
* … understand the potential benefits and risks that LA technologies can bring, for educational research and practice
* … become acquainted with multiple LA tools, as well as underlying  technologies and learning resources where you can deepen your knowledge of this research field and its practice



## Why learning analytics?

Global trends in education are turning towards more **"evidence-based" approaches**, both institutional management and educational policy, but also everyday classroom teaching and learning processes. However, the question of how to get such "evidence" to the relevant stakeholders (policy-makers, teachers, school leaders, and even students) remains.

As the use of digital platforms for learning becomes more and more widespread, especially in higher education and semi-formal courses (e.g., massive open online courses -- MOOCs), there is a potential to apply big data and machine learning techniques to process and make sense of the data such digital platforms generate.

The key overarching question that learning analytics research explores thus is: **"Can these computational techniques help get evidence about (and better  understand) learning?"**

## Towards your own definition of learning analytics

> **Exercise**: Rather than reading and ~~not~~ memorizing a formal definition of what learning analytics is, let's see if we can reason by induction (i.e., from concrete examples to abstract concepts) and come up with our own definition of what LA technologies and solutions do. Please follow these steps (you can do them alone or with a group of fellow students):
> 1. Read [this webpage](https://isit.arts.ubc.ca/learning-analytics-examples/) that briefly describes several real LA systems.
> 2. Reflect and write down: What seems to be the purpose of these systems? Who uses them? What is common across these examples? What is different? You can note down complete sentences, or just a few suggestive keywords.
> 3. Build up, in a sentence or two, a definition with your understanding of what LA is.


## The "official" definition of Learning Analytics

According to the [Society for Learning Analytics Research (SoLAR)](https://www.solaresearch.org/about/what-is-learning-analytics/), "learning analytics is **the measurement, collection, analysis and  reporting of data about learners and their contexts, for purposes of  understanding and optimising learning and the environments in which it occurs**".

One may wonder how this definition is different from the whole field of educational research. The key difference is that LA solutions tend to make use of **preexisting, machine-readable data**, and apply **computational techniques** (e.g., machine learning) to handle the resulting ‘big data’, something that would not be practicable manually {% cite ferguson %}.

## Benefits and Challenges of LA

### Understanding the design space of LA solutions

According to the definitions above, we could design many kinds of learning analytics solutions. Greller & Drachsler proposed a conceptual framework that can help us both **describe** existing LA systems (in terms other LA researchers can easily understand) and even **generate** ideas for new ones {% cite greller %}.

According to this framework, we can describe an LA innovation along six “critical dimensions”:

1. **Stakeholders**: the people involved directly or indirectly in the system's usage. Key stakeholders are the data subjects (from whom the data is gathered), and data clients (to whom the data analyses are shown).
2. **Objective**: the goal of the system, what activity it performs or aims to support, e.g., teacher reflection, prediction of performance, etc.
3. **Data**: the characteristics of the data involved, what indicators do the datasets contain, what is their timeframe, etc.
4. **Instruments**: what devices are used to process and transform the data, including analysis techniques, underlying pedagogy, form of data presentation, etc.
5. **External limitations**: social conventions and norms that may impact the use of the system (e.g., ethics and privacy regulations).
6. **Internal limitations**: other constraints on the use of the system, rather stemming from the stakeholders themselves, like the competence required to understand the outputs of the data analysis (data literacy), etc.

## Learning Analytics Processes

Aside from the "static view" of a system that the six dimensions above provide, it is also important to understand the (dynamic) **processes** that the functioning or development of an LA solution entail. You can see a couple of examples below:

<img width="744" alt="Two learning analytics processes, by Siemens {% cite siemens %} (2013, left) and Shankar et al. {% cite shankar %}(2020, right)" src="https://user-images.githubusercontent.com/105489417/169746662-d3d3b1bc-f844-449b-b21f-bca76e156c6f.png">

## Benefits of Learning Analytics

Learning analytics has become a popular research field because LA solutions have multiple specific benefits, which we could group in two broad categories:

### A novel tool for gathering evidence about learning & teaching in practice

In the educational sciences, gathering data (e.g., interviews, questionnaires, etc.) is costly. This in turn leads to such data collection to be rather infrequently (e.g., only before and after an intervention). Additionally, traditional data sources like exams, long questionnaires, interviews, etc. place an emphasis on the learning *outcomes*, rather than the learning *process*. This leads to using a lot "gut feeling" during the learning processes in everyday educational practice (and policy). This also means that, once the outcomes are gathered after the fact, little can be done to support or help the students that provided the data.

In contrast, if people use digital tools for learning, machines can automatically gather **detailed, ongoing data about the learning process**, e.g., from platform logs (actions, clicks, taps), intermediate artifacts (think, GoogleDocs and its revision  history). Such data can give a greater insight into the learning process and how the final outcomes are reached. Moreover, machines can even analyze the (large volumen of) data for us, using big data techniques, machine learning, and datamining, therefore providing **faster insights**.

Even in cases where learners do not use technology for learning, we can apply learning analytics to the physical world through sensors (e.g., cameras, microphones, eye-trackers, movement trackers, etc.), which can then be analyzed using what has been termed "multimodal learning analytics", an emergent sub-field of LA {% cite blikstein %} {% cite dimitri %}.

### A novel method for educational researchers

For researchers trying to understand (complex) learning, LA is a great tool in our methodological toolkit. Although it probably will not be our sole tool, LA may be tremendously helpful in **data triangulation**. LA would be especially appropriate when we need to **focus on process, temporality**, and not only the outcomes of a learning situation... or when we need to analyze learning at a **large scale**.

## Challenges of learning analytics

In the same way that learning analytics can provide specific benefits, it should be noted that it is a relatively novel field and, as such, multiple challenges arise when trying to apply it in a new educational context. These challenges can be grouped in three broad areas:

### Technical challenges

Applying learning analytics in a new context is still **technically complex**, as only very basic analytics are available in mainstream platforms like Moodle or Blackboard. If we want to go further and apply LA to multiple different platforms or data sources, we may need to resort to (less-tested, more experimental) research prototypes. Make sure you have some technical support around when attempting this, or that you collaborate with experts in the technical side of this interdisciplinary field, to help you overcome any technical, prototype-related issues.

For instance, a classic, yet unsolved technical problem in LA is that of **interoperability**. Think about your latest courses: most probably you were using multiple platforms (e.g., Moodle and Google Slides). Even if these different systems are able to gather data about what happens in the learning process... can these systems talk to each other? Can the instructor get a **unified** view of the process? Although there have been some initial solutions proposed, like the xAPI standard and generic infrastructures for LA, the problem is far from being solved in a general sense.

### Educational challenges

**Interpreting** the data output by learning analytics solutions is also a challenge. Learning processes are known to be highly contextual, and individual differences matter a lot. Even in "purely online" experiences, learning still happens in the physical world. When looking at the outputs of an LA system, we need to consider: Can some **extraneous aspect** be causing this data? (short answer: probably yes!). For example, a temporary lack of activity from a learner in the system can indicate that they are thinking hard about the answer... but it could also be because the student was interrupted by someone else in the room. Hence, beware of over-simplistic interpretations and extrapolations from a single source of (digital) data, with no knowledge of the physical context.

In LA research there is a strong emphasis on **theory/pedagogical grounding of analyses**. The results of LA should still make sense when seen from the point of view of some learning/pedagogical theory. As a consequence, particular analysis approaches have been devised to understand learning under certain pedagogies like collaborative learning {% cite chejara2020 %}, inquiry learning, or knowledge building.


## Ethical challenges

As in other fields where analytics and big data are applied, LA can have ethical implications. These implications include: the need for respecting privacy, users' agency, avoiding  risks, and biases. In the LA field, researchers are also trying to police themselves and the use, practice and implementation of LA. As a result of such monitoring, for instance, the **DELICATE** framework emerged{% cite drachsler %}. You can use this framework (pictured below) as a checklist to analyze different ethical aspects that to take into consideration when implementing LA in an educational setting:


<img width="262" alt="The DELICATE ethical framework for learning analytics" src="https://user-images.githubusercontent.com/105489417/169748539-338d7873-3ac5-4061-8fe1-736154cb6cf4.png">


## Learning analytics tools and toolkits

With all the knowledge we have accummulated throughout the previous sections, let's now look at a few real examples of LA solutions for particular purposes and settings... and what toolkits you could use to build your own prototypes, if you don't find a solution among those other researchers have built.

### Tool example: Analyzing small-group collaboration with CoTrack

Small-group collaboration is a very common learning arrangement, both in face-to-face courses and online. Good collaboration, however, has multiple components which are quite difficult to track even for experienced teachers: sharing knowledge, mutual understanding, argumentation, etc.

CoTrack is a web-based tool that looks like a mix between Google Docs (it features a shared text editor) and Zoom (it has videoconferencing features). It aims to support teachers to manage classrooms of small groups working together by shifting from just "mirroring the data" to "guiding" the teacher to intervene effectively {% cite chejara2020 %} {% cite chejara2021 %} {% cite kasepalu %}. To do so, it uses audio, video and log data to try to estimate whether the group is having a "good collaboration".

The CoTrack prototype is available at [https://www.cotrack.website/en-gb/](https://www.cotrack.website/en-gb/).

> **Exercise**: Take a look at the description of CoTrack in the papers referenced above, and try to describe it along the six dimensions of the LA design space mentioned in a previous section. Are you able to do that?

### Tool example: Enabling recurrent, fast-loop questionnaire analytics for teachers and learners with LAPills

Learning analytics are still too complex for everyday classroom use. For most teachers, it only makes sense to use LA if you are teaching a fully online, probably large-scale course (as there the benefits of increased awareness will clearly outweigh the cost of implementing this new technology). Still, analytics offered by most platforms are generic, and do not give useful information for the particular context of a teacher's lesson. LAPills tries to be the simplest LA platform to help a teacher see the benefits at a low cost/effort{% cite prieto %}.

LAPills is based on the idea of having reusable templates for a tiny LA solution, which includes the learning design (i.e., the sequence of learning activities in the lesson), the means to gather data along the sequence of activities (in the form of questionnaires) and customized analytics that are contextualized for the particular lesson.

The LAPills prototype is available at [https://web.htk.tlu.ee/lapills/](https://web.htk.tlu.ee/lapills/).

### Implementing new LA Prototypes: Languages & Toolkits

These and many of the other LA tools we have seen in this chapter have been implemented using a few common languages and toolkits, which are also used in other data science fields:

  - **[R](https://www.r-project.org/)** (a popular statistical language for data science) and publishing services like **[Shiny](https://shiny.rstudio.com/)** to make your custom analyses and dashboards visible to others.

  - **[Python](https://www.python.org/)** (a general-purpose programming language with a lot of data science and machine  learning libraries, especially if you need "deep neural networks" stuff).

  - For data visualizations and dashboards, see also **[Plotly/Dash](https://plotly.com/)**, and **[Kibana](https://www.elastic.co/kibana/kibana-dashboard)**.

  - Most of those will require some programming skills. For those of you that are not fond of programming, graphical interface alternatives include **[KNIME](https://www.knime.com/)**, **[Tableau](https://www.tableau.com/)** or **[RapidMiner](https://rapidminer.com/)**.


## Researching learning analytics: Where do I start?

You want to do research in LA, and don't know where to start? You can do worse than taking a look at the free, open [“Handbook of Learning Analytics”](https://www.solaresearch.org/publications/hla-17/). The book covers the **foundations** of the field (what is LA, computational methods, ethics, and measurement), particular **techniques** (different ways of implementing LA: analysis, design, visualization…), **applications** (where has LA been successfully applied, and to understand what learning constructs), **institutional strategies**, and **systems perspectives** (i.e., high-level issues and challenges). This book will help you familiarize with the field's terminology and most popular "hot topics".

## Types of LA-like research: Paradigms and communities

There's many overlapping, related or similar terms to "Learning Analytics" (LA). Particular sub-types include *Academic Analytics* (which normally feature institutions as data clients), *Teaching Analytics* (which use teachers as key data subjects), etc.

On the other hand, different (but very related) research communities to LA include: Educational Datamining (EDM), AI in Education (AIED), Learning at Scale (L@S), Intelligent Tutoring Systems (ITS), or Quantitative Ethnography (QE). Each of those communities has its own conferences, journals and ways of thinking!

In this sense, we could define broad, non-exclusive paradigms within LA and related fields {% cite baker %}. Some researchers try to understand learning systems/situations "as a whole" (a dialectical approach, represented by the LA community and the LAK conference); de-composing the socio-technical system into components and analyzing components and their relationships (a reductionist approach, represented most vividly by the EDM community); predicting without comprehension or explanation (an essentialist approach, often featured in the L@S conference); or understanding individual experiences, processes, and their variety (an existentialist approach, typical of the QE field and its ICQE conference).


## Summary and further resources

Learning analytics is all about using new sources of data and analytics techniques to understand and improve learning. LA is an interdisciplinary field, with strong technical content, but also a strong pedagogical/theoretical grounding. Many stakeholders are involved in the design, evaluation and ongoing implementation of LA solutions (students, teachers, developers, administrators, leaders…). Given this human complexity in implementing and deploying LA, it tends to be a lengthy process that requires lots of dialogue.

The good news is that LA is still a young field, so there is lots of space for you to put your "research footprint" on as a novice researcher. New techniques, ways of conceptualizing, contexts of application… the list is endless!

You can deepen your knowledge of LA by visiting any of the following educational resources:

* The free [Handbook of Learning Analytics](https://www.solaresearch.org/publications/hla-17/) by the Society for Learning Analytics Research (SoLAR), now it its [second edition](https://www.solaresearch.org/publications/hla-22/).
* The [Learning Analytics 101](https://steinhardt.nyu.edu/learning-analytics-101) educational resource by New York University, provides a more in-depth view of several areas of LA.
* [Practical Learning Analytics](https://www.edx.org/course/practical-learning-analytics), a massive open online course on the topic by the University of Michigan.
* Prinsloo, Slade and Khalil's [Learning Analytics: A Primer](https://oasis.col.org/items/b35591a9-f1ad-454c-a3c5-d728ea694861), another mini-course on the topic, in a single PDF.

