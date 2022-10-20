---
layout: reading_chapter
title: A Gentle Introduction to Learning Analytics
authors:
hide: true
permalink: /chapter/aois/learning-analytics/
---


**Purpose/Abstract:** This chapter brings you an overview and a gentle introduction to learning analytics. After describing learning analytics and its use purposes, you will learn about some examples of learning analytics tools and the settings you could use them. The chapter aims to compile enough content  for a beginner friendly introduction, and provides some additional resources for you to explore afterwards.

# Why Learning Analytics?

Global trends in education are turning towards "evidence-based" approaches in teaching, institutional management, and educational policy. However, although the concrete provable aspects become prominent, the question of how to get such "evidence" to the people remains. As the use of digital platforms for learning is widespread, especially in higher education and semi-formal courses (e.g. MOOCs), it brings together big data, machine learning, etc.  to process data from digital platforms (Google, Amazon, Facebook) at scale. 

# Describing Learning Analytics

According to the Society for Learning Analytics Research (SoLAR), "*learning analytics* is the measurement, collection, analysis and  reporting of data about learners and their contexts, for purposes of  understanding and optimising learning and the environments in which it occurs". However, it differentiates from *good-old"* educational research by making use of preexisting, machine-readable data. By doing so, LA techniques can handle ‘big data’, not be practicable manually.


# Benefits and Challenges of LA

Different types of learning analytics are created based on a conceptual framework to understand the design space of LA. The conceptual framework is useful for:

  i. Describing a learning analytics solution in terms other LA researchers can understand

  ii.Proposing/designing new LA solution ideas that deﬁnes the “design space” of most learning analytics systems/innovations

We can describe an LA innovation in 6 “critical dimensions”:

1. **Stakeholders**: the people involved, mainly data subjects (data from),  and data clients (data to) 
2. **Objective**: reﬂection, prediction, … 
3. **Data**: dataset, indicators, timeframe 
4. **Instruments**: what analysis techniques, underlying pedagogy, form of presentation 
5. **External limitations**: conventions, norms (e.g., ethics and privacy) 
6. **Internal limitations**: Required competences by stakeholders, etc. 

## Learning Analytics Processes

<img width="744" alt="Screen Shot 2022-05-23 at 07 59 20" src="https://user-images.githubusercontent.com/105489417/169746662-d3d3b1bc-f844-449b-b21f-bca76e156c6f.png">

## Beneﬁts of Learning Analytics: A tool for gathering  evidence about learning & teaching

In educational sciences, getting data is costly which causes it to be also infrequent. Exams, long questionnaires, interviews, etc. places an emphasis on outcomes and not the process. This leads to a lot of “gut feeling” in the everyday educational practice, and policy. 

If people use digital tools for learning, machines can automatically gather detailed, ongoing data from platform logs (actions, clicks, taps), intermediate artifacts (think GoogleDocs and its revision  history). Such data can give a greater insight into the learning process until we reach the outcomes. Moreover, machines can even analyze the data for you (big data techniques, machine learning, and datamining), providing faster insights. 

Even when people do not use technology for learning, you can apply learning analytics thtough sensors, which is exhibited in Multimodal Learning Analytics as a sub-ﬁeld of LA (e.g. CoTrack).

If you are a researcher trying to understand (complex) learning, LA is a great tool in your methods kit (not the sole tool as it helps triangulation) when you need to focus on process, temporality, and not only the outcomes, or when you need to analyze learning at large scale. 

## Challenges of Learning Analytics: Technical

It is still technically complex as only very basic analytics available in mainstream platforms (e.g.,  Moodle, Blackboard). If you want multiple sources, you may need research  prototypes. Make sure you have some technical support around or that you collaborate with experts in the tech side of things to overcome any prototype-related issues. 

A usual problem is **interoperability**;for instance, think about this workshop: we have CoTrack and Google Slides. Can these systems talk to each other? Can the instructor get a **uniﬁed** view?
Some initial solutions can be standards (xAPI) and infrastructures for LA.

## Challenges of Learning Analytics: Educational

Interpreting the LA data is a challenge. Learning processes are known to be highly contextual, and individual diﬀerences matter a lot. Even in “purely online” experiences, learning still happens in the physical world. Can some extraneous aspect be causing this data? (short answer: yes!) Beware of over-simplistic interpretations and extrapolations from a single source of (digital) data, with no knowledge of context. 

In LA research there is a strong emphasis on theory/pedagogical grounding of analyses. The results of LA should still make sense when seen from the point of view of some learning/pedagogical theory. For example; particular analysis approaches to understand learning under certain pedagogies like collaborative learning, inquiry learning, and knowledge building.


## Challenges of Learning Analytics: Ethical

As in other ﬁelds where analytics and big data are applied, LA can have ethical implications. These implications include: respecting privacy, users’ agency, avoiding  risks, and biases. In the LA ﬁeld, researchers are also trying to police themselves and the use/practice/implementation of LA. As a result of such monitoring, DELICATE ethical framework emerged. 


<img width="262" alt="Screen Shot 2022-05-23 at 08 18 58" src="https://user-images.githubusercontent.com/105489417/169748539-338d7873-3ac5-4061-8fe1-736154cb6cf4.png">


# Infrastructures, Tools, and Toolkits
## Learning Analytics Tools: Analyzing small-group collaboration: CoTrack

Small-group collaboration is a very common learning arrangement, face-to-face and  online. Good collaboration has multiple components are listed as sharing knowledge, mutual understanding, and argumentation. What audio/video/log features best characterize  “good collaboration”?

CoTrack helps us to support teachers to manage small groups by shifting from just “mirroring the data” to “guiding” the teacher to intervene eﬀectively.

## Learning Analytics Tools: Enabling recurrent, fast-loop questionnaire analytics  for teachers & learners: LAPills

Learning analytics are still too complex for everyday classroom use. For most teachers, it only makes sense if you are fully online, probably large course (cost vs. beneﬁt). Still, analytics are generic, do not give useful information  for the context of the lesson. LAPills is the simplest LA platform to help a teacher see the beneﬁts at a low cost/eﬀort.

LAPills is based on the idea of reusable templates = design + data  gathering + analytics (contextualized for it). The tool uses advanced, custom visualizations by integration with R/Shiny.

## Implementing new LA Prototypes:  Languages & Toolkits

These and many of the other LA tools we have seen today have been implemented using a few common languages and toolkits, also used in other data sciences:

  - **R** (statistical language for data science) + publishing services like Shiny
  
  - **Python** (general-purpose language with a lot of data science and machine  learning libraries, especially “deep neural networks” stuﬀ)
  
  - For visualizations, see also **Plotly/Dash**, **Kibana**
  
  - Most of those will require some programming skills, non-programmy  alternatives include **KNIME**, **Tableau** and **RapidMiner**


# Researching Learning Analytics: Paradigms

You want to do research in LA, and don't know where to start? Take a look at the free, open [“Handbook of Learning Analytics”](https://www.solaresearch.org/publications/hla-17/). The book covers the **foundations** (what is LA, computational methods, ethics, and measurement), **techniques** (diﬀerent ways of implementing LA: analysis, design, visualization…), **applications** (where has LA been successfully applied, and to understand what learning constructs), **institutional strategies**, and **systems perspectives** (high-level issues and challenges).

## Types of LA-like research: Paradigms and communities

There’s many related/similar terms to “Learning Analytics” (LA). Particular sub-types can be listed as *Academic Analytics* (institution as client), *Teaching Analytics* (teacher as subject), etc. Diﬀerent but very related research communities are: Educational Datamining (EDM), AI in
Education (AIED), Learning at Scale (L@S), Intelligent Tutoring Systems (ITS), Quantitative  Ethnography (QE). Each of those has its own conferences, journals and ways of thinking!

Broad, non-exclusive paradigms of LA constitute understanding learning systems/situations “as a whole” (dialectical, LAK), de-composing system into components and analyzing components and their relationships (reductionist, EDM), predicting without comprehension or explanation (essentialist, L@S), and understanding individual experiences, processes, & their variety (existentialist, ICQE).


# Summary/Overview

Learning Analytics is about using new sources of data and analytics techniques to understand and improve learning. LA is an interdisciplinary ﬁeld, with strong technical content, but also a strong pedagogical/theoretical grounding. Many stakeholders are involved (clients, subjects, developers, administrators…) as LA is complex to implement and deploy, requires lots of dialogue.

LA is still a young ﬁeld, so there is lots of space for you to put your “research footprint” on. New techniques, ways of conceptualizing, contexts and constructs of  application… the list is endless!

You can deepen your knowledge of LA by visiting the ["Moodle course"](https://moodle.tech4comp.dbis.rwth-aachen.de/login/index.php) for further material suggestions (e.g. Handbook of LA, MOOCs on LA, and more).



# Further References and Resources
  Baker, R. S., Gašević, D., & Karumbaiah, S. (2021). Four Paradigms in Learning Analytics: Why Paradigm Convergence Matters. Computers and  Education: Artificial Intelligence, 100021. https://doi.org/10.1016/j.caeai.2021.100021

  Blikstein, P., & Worsley, M. (2016). Multimodal learning analytics and education data mining: Using computational technologies to measure complex  learning tasks. Journal of Learning Analytics, 3(2), 220-238.

  Chejara, P., Prieto, L. P., Ruiz-Calleja, A., Rodríguez-Triana, M. J., Shankar, S. K., & Kasepalu, R. (2021). EFAR-MMLA: An Evaluation Framework to 22  Assess and Report Generalizability of Machine Learning Models in MMLA. Sensors, 21(8), 2863.

  Chejara, P., Kasepalu, R., Shankar, S. K., Prieto, L. P., Rodríguez-Triana, M. J., & Ruiz-Calleja, A. (2020). MMLA Approach to Track Collaborative  Behavior in Face-to-Face Blended Settings.

  Di Mitri, D., Schneider, J., Specht, M., & Drachsler, H. (2018). From signals to knowledge: A conceptual model for multimodal learning analytics.  Journal of Computer Assisted Learning, 34(4), 338-349.

  Drachsler, H., & Greller, W. (2016). Privacy and analytics: it's a DELICATE issue a checklist  
for trusted learning analytics. In Proceedings of the 6th International Conference on Learning  Analytics & Knowledge (pp. 89-98). ACM.

  Ferguson, R. (2012). Learning analytics: drivers, developments and challenges. International Journal of Technology Enhanced Learning, 4(5/6),  304-317.

  Greller, W., & Drachsler, H. (2012). Translating Learning into Numbers: A Generic Framework for Learning Analytics. Journal of Educational  Technology & Society, 15(3), 42-57.
    
  Kasepalu, R., Chejara, P., Prieto, L. P., & Ley, T. (2021). Do Teachers Find Dashboards Trustworthy, Actionable and Useful? A Vignette Study Using  a Logs and Audio Dashboard. Technology, Knowledge and Learning, 1-19.

  Lang, C., Siemens, G., Wise, A., & Gasevic, D. (Eds.). (2017). Handbook of learning analytics. New York, NY, USA: SOLAR, Society for Learning  Analytics and Research. https://www.solaresearch.org/publications/hla-17/

  Martinez-Maldonado, R., Echeverria, V., Fernandez Nieto, G., & Buckingham Shum, S. (2020, April). From data to insights: a layered storytelling  approach for multimodal learning analytics. In Proceedings of the 2020 chi conference on human factors in computing systems (pp. 1-15).

  Samuelsen, J., Chen, W., & Wasson, B. (2019). Integrating multiple data sources for learning analytics—review of literature. Research and Practice  in Technology Enhanced Learning, 14(1), 1-20.

  Siemens, G. (2013). Learning analytics: The emergence of a discipline. American Behavioral Scientist, 57(10), 1380-1400.

  Shankar, S. K., Rodríguez-Triana, M. J., Ruiz-Calleja, A., Prieto, L. P., Chejara, P., & Martínez-Monés, A. (2020). Multimodal Data Value Chain
(M-DVC): A Conceptual Tool to Support the Development of Multimodal Learning Analytics Solutions. IEEE Revista Iberoamericana de Tecnologias  del Aprendizaje, 15(2), 113-122.

