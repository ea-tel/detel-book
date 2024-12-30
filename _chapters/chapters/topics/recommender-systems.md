---
layout: reading_chapter
title: Recommender Systems
authors: <br>Hasan Abu-Rasheed, University of Siegen, Germany<br>Krist Shingjergji, Open Universtiteit, Netherlands<br>Irene-Angelica Chounta, University of Duisburg-Essen, Germany
hide: true
permalink: /chapter/topics/
---

**Abstract:** This chapter explores the fundamental concepts, types, and applications of recommender systems (RS), emphasizing their growing significance in educational contexts. It provides an overview of RS, covering their definition, key algorithms (collaborative filtering, content-based methods, and hybrid models), and advanced techniques like graph-based and context-aware approaches. It also highlights RS applications in education, such as learning material and path recommendations, and delves into challenges like ethical concerns, personalization, and privacy issues. 

# 1. Introduction

In an increasingly data-driven world, recommender systems (RS) have gained more importance in helping users find and navigate large amounts of information. From personalized movie recommendations we receive from streaming platforms like Netflix, to suggestions of commercial products on digital marketplaces like Amazon, those recommendation systems have noticeably influenced our digital experiences.

The use of Recommendation systems, however, is not limited to those entertainment and commercial use cases. It extends to provide a great value-added to researchers, students, and teachers, for whom, RS are getting an increasing value for identifying and suggesting relevant papers to read, journals to publish in, books and references to refer to, as well as other resources for learning. This service from RS is proving every day that it can be a time-saver and a potential tool to support research, teaching, and learning.

Recommendation systems build on a wide range of technologies to achieve their goal of generating personalized suggestions. They utilize traditional and advanced sets of approaches and algorithms, from information retrieval and filtering to machine and deep learning. Their mechanisms, although diverse and potentially complex, rely in general on a straightforward pipeline for data flow. They require, on the input side of the system, data about the person or entity, who is requesting the recommendation, e.g., student, and data about the items that are being recommended, e.g. books, movies, etc. On the output of the system, a personalized suggestion, which takes the form of an individual item or a ranked list of items, is expected. It is worth mentioning here that the recommended items can also be persons, as in friend recommendations on a social media platform. It is not likely, however, for an item, such as a book, to be the one requesting the recommendation! Well, not yet that is.

Back to our topic in this chapter, in order to be able to utilize the personalized recommendations, and furthermore make an informed decision about them, it is important to understand how recommender systems work, and how they reach a conclusion that a certain item is relevant to us as users. The more sensitive the recommendation is, the more critical this knowledge becomes. Think of a student asking for a recommendation on a learning path. A recommender system may generate a learning path suggestion that requires six months of time to finish. This time investment would be an expensive one to lose, if the student followed the recommendation without critically thinking of its validity and making an informed decision, based on the knowledge, even roughly, of how the system achieved that learning path recommendation.

In this chapter, we try to cover the basics of recommender systems, starting with their definition, and continuing to their different types, how each type works (briefly), their applications in the educational setting, and finally their challenges, limitations, and potential future directions.

# 2. Definition (What is a recommender system?)

According to Wikipedia, _Recommender systems are a subclass of information filtering system that provides suggestions for items that are most pertinent to a particular user._

Recommender systems (RS) can be defined as _software tools that help the user in making decisions when the provided information is overwhelming_ {% cite ricci_recommender_2022 %}. They can become considerably important when the options available for buying an item or receiving a service vary over a wide range, such as the wide variety of online courses available for a certain topic.

The definition of RS can also be considered from the application dimensions and contexts. Therefore, we can define RS as follows from the technical, functional, and algorithmic contexts:

1. Technical Definition:
    - A software application that employs algorithms to predict and recommend items to users by analyzing data such as user interactions, item features, and user-item interactions.
2. Functional Definition:
    - A tool used to filter information and provide users with relevant content or products they might be interested in, often used in e-commerce, streaming services, social media, and other online platforms.
3. Algorithmic Definition:
    - A system that uses methods like collaborative filtering, content-based filtering, and hybrid approaches to analyze user data and make personalized recommendations.

Each of these definitions highlights different aspects of a recommender system, such as its _purpose_, _functionality_, or underlying technology. The variation in definitions allows for flexibility in how the concept is applied across different industries and use cases.

# 3. Types of Recommender Systems

Since their early days in the 1990s, recommender systems were developed under several categories that correspond to the reasoning process of the RS. The first concept of comparing users and the items, that are to be recommended, appeared in the work of Belkin and Croft in 1992 {% cite belkin_information_1992 %}, as well as Goldberg et al. {% cite goldberg_using_1992 %}, and was known as collaborative filtering. Recommendation approaches were then developed to reflect different reasoning processes, which correspond to different applications and contexts of the recommender system.

The categories that RS were classified into include:

## 3.1 Traditional recommender systems

This category includes the first two types of RS, namely _collaborative filtering_ and _content-based recommenders_, which were the dominant types of RS for decades, despite the drawbacks they faced. This is partially due to the simple algorithms they followed, and their focus on the similarities between system users, or between the items that are being recommended, such as books, news articles, etc.

### 3.1.1 Collaborative filtering (CF):

Collaborative filtering is the recommendation approach where the RS uses the behavior and/or preferences of users to define similarities among them. The same concept can be also implemented to find similarities between the recommended items, through their ratings. In the former case, which is referred to as User-User CF, the system recommends to user A items that a similar user B liked, see Figure 1.

<p align="center">
<img src="https://github.com/CleoSchulten/detel-hack-jtelss2024/blob/d06fdf32379ae0b0ded3c27db6e6df640efb996b/assets/images/collaborative_filtering_RS.png" alt="Internal Image" width="500px">
<br>User-User collaborative filtering RS
</p>

### 3.1.2 Content-based (CB):

This type of recommender system relies on pre-defined rules to recommend items based on their metadata and the user’s previous interaction with part of these items. For example, if the learner shows interest in article A, the system will recommend to the learner article B if it has a similar, e.g., content or description, see Figure 2.

<p align="center">
<img src="https://github.com/CleoSchulten/detel-hack-jtelss2024/blob/d06fdf32379ae0b0ded3c27db6e6df640efb996b/assets/images/content_based_RS.png" alt="Internal Image" width="500px">
<br>Conten Based RS
</p>

As a result of the logic that CF and CB recommendation systems follow, each type faces limitations that affect its output. CF recommender systems rely on the behavior and preferences that are stored in the user profile to make a recommendation by finding similar users. This means that a new user in the system, whose profile does not have yt information about their preferences, will not get sound recommendations. This issue is referred to as the “cold-start” problem of recommender systems {% cite hasan_traditional_2024 %}.

On the other hand, a CB recommender system will recommend items to a user, which are similar to items the user already liked. This logic may lead to a problem of over-specialization of the recommended items, meaning that the user will only receive recommendations from a smaller group of items that are similar to the items the user interacted with before. To account for those limitations of CF and CB recommenders, hybridizing the recommendation logic was introduced, to utilize the best of each algorithm, and mitigate its limitations {% cite dong_brief_2022 %}.

## 3.2 Hybrid RS

Hybrid RS combine multiple recommendation techniques to overcome their limitations and enhance the overall accuracy and output diversity. There are multiple approaches used to achieve this hybridization:

- Combining predictions
- Augmenting features
- Unifying recommendation models

An example of this approach can be seen on Netflix. Netflix streaming service uses a hybrid recommendation system, in which collaborative filtering and content-based recommendation algorithms are combined. The collaborative filtering RS is used to analyze user behavior and preferences, while the content-based RS is used to analyze the attributes of the shows. This approach allows Netflix to recommend content that the user is most likely to prefer or accept, and at the same time recommend new and diverse content. For instance, if the user has watched several shows from the Science-Fiction genre, the hybrid RS will recommend popular shoes from that genre (collaborative filtering, since popularity is a result of the rating of many similar users). The RS will also recommend new content from the science-fiction genre (content-based) even if it was not rated by many users. The resulting recommendation aims to balance the recommended materials to the user.

## 3.3 Context-aware RS

Context-aware recommendation algorithms enhance traditional algorithms by incorporating contextual information, such as the time of the day, user location, or the social setting, to offer more relevant recommendations.

The “context” is defined here as the information that can be used to characterize the situation of an entity (the user or the item) in a certain interaction. This information is then used to adjust the weights of items to be recommended or filter them, to tailor the final recommendation to the situation in hand. An example of such recommender systems is music streaming services, which may recommend more “upbeat” musical content on Friday evenings than they would usually recommend on a weekday afternoon. The time factor is considered here to describe the user’s context and tailor the recommendation to that situation even if not explicitly requested by the user as a preference.

It is worth noting here that the context itself can be very dynamic, meaning that context-aware RS needs to adapt to the context changes. Moreover, the user control over the recommendation, e.g., through their preferences, should not be overwritten by the context factors, as the main goal is to provide the user with content they will most likely prefer or accept.

## 3.4 Graph-based RS

Graph-based recommenders utilize graph theory to model user preferences and items in a network structure. In this network, nodes represent users and items, while relations (also called _edges_) represent the connections between users and items. A connection may depict, e.g., an action like buying a product or watching a show.

Building on this logic, it is noticeable that connections among users and items can represent several types of interaction, not only one. This allows the graph to provide a rich representation of the user preferences, context, and characteristics, as well as item attributes. This also leads to having more flexibility in terms of defining new types of entities and relationships, as well as updating and modifying the existing ones. Graph-based recommendations possess a scalability advantage, as their interconnected nature allows for modeling large-scale databases.

However, the flexibility and scalability of graph-based RS come at the cost of more complexity in the construction of the graph and the algorithms needed to search and extract the recommended items from it, which may be more computationally demanding than the algorithms in, e.g., collaborative filtering or content-based RS.

Graph-based recommender systems usually use algorithms such as path analysis and finding, neighbor voting, and graph random walks, to find similar (close nodes in the graph) items to a certain user.

An example of graph-based recommendations is the recommender system in Pinterest, which analyzes user engagement behavior and item similarities in a graph database of users and items, to recommend relevant content.

Figure 3 illustrates a graph-based recommendation system, which tries to predict indirect links/relations between a social media network, in order to recommend potential friend connections to users, based on their shared friends.

<p align="center">
<img src="https://github.com/CleoSchulten/detel-hack-jtelss2024/blob/d06fdf32379ae0b0ded3c27db6e6df640efb996b/assets/images/graph_based_RS.png" alt="Internal Image" width="500px">
<br>Graph-based recommendation through link prediction {% cite cui_graph-based_nodate %}
</p>

# 4. Applications of Recommender Systems in educational settings

Recommender systems have found diverse and impactful applications in the field of education, particularly in e-learning, aiming to enhance personalized learning experiences and optimize educational resources for both students and educators. Several literature reviews provide valuable insights into the different types of applications, their purposes, and their benefits across various educational contexts.

Specifically, in e-learning, the different applications of recommender systems include {% cite zhang_recommender_2022 %}:

1. Learning material recommendations:  
        Different users require appropriate learning materials tailored to their knowledge level and current needs. The primary form of these learning materials is text which involves the use of **content-based techniques**.

One interesting example is the personalized citation recommendation. In {% cite cai_three-layered_2018 %}, the authors propose a three-layered (paper, author, venue) interactive clustering approach to cluster related vertices in the graph (Figure 4).

<p align="center">
<img src="https://github.com/Hasan-AR/detel-book/blob/a0f42c9af50182f3a3a51870cc37f8b14a4150db/assets/images/three_layered_clustering.png" alt="Internal Image" width="500px">
<br>Three-layered (paper, author, venue) interactive clustering approach {% cite cai_three-layered_2018 %}
</p>

2. Learning object recommendation:  
        Unlike learning materials, learning objects refer to distinct, granular items such as exercises, questions, and examples. Recommending these learning objects is typically accomplished through **knowledge-based techniques**.

One example is the work in {% cite wan_hybrid_2020 %} where authors proposed a hybrid filtering approach for recommending learning objectives to students. That was achieved by their proposed framework which combined three modules namely, the _learner module,_ the _recommendation module,_ and the _interactive module_ (Figure 5). The learner module with the learner influence model aims to address interpersonal information sparsity and cold start problems in e-learning. The recommendation module aims to simulate learners’ collaborative behaviors and give learners cliques using a self-organization-based recommendation. In the interactive module students' activities are being recorded, e.g., studying records.

<p align="center">
<img src="https://github.com/Hasan-AR/detel-book/blob/e6a47a9dbecb77d1b737e467d32373c9719a27a2/assets/images/framework_three_modules.png" alt="Internal Image" width="500px">
<br>Proposed framework in {% cite wan_hybrid_2020 %} with the learner module, the recommendation module, and the interactive module
</p>

3. Learning path recommendation:  
        A learning path consists of a series of items, which may include learning materials, learning objects, or learning activities. Due to the complexity of this function, **sequence modeling and recurrent neural networks** (RNNs) are commonly employed because of their inherent strengths in handling sequential data. For example, in {% cite zhou_personalized_2018 %} the authors developed a full-path learning recommendation by clustering a group of learners based on a feature similarity metric and training a long short-term memory (LSTM) model, i.e., a type of RNN, to predict their learning paths and performance.
4. Learning activity recommendation:  
        Learning activities generally cover broader contexts, such as classes or events involving students. Recommendations for these activities are typically achieved through content-based, collaborative filtering (CF)-based, or hybrid methods.
5. Others: e.g., exercise difficulty ranking, knowledge requirement acquisition.

Similarly, a systematic review {% cite urdaneta-ponte_recommendation_2021 %} that analyzed 56 articles from the period 2015-2020 that focus on the use of recommender systems in education identified their primary purposes to be recommending learning resources and courses. Additionally, the authors in {% cite deschenes_recommender_2020 %} focused their systematic on recommender systems that support students’ agency (i.e., the learner’s ability to set and pursue learning goals). They also analyzed 56 articles in the timeframe 2008-2018 and found that the main purpose of the relevant studies was to recommend quality content, with other purposes including suggesting learning activities and helping students find peers.

These studies collectively underscore that the central aim of recommender systems in technology-enhanced learning is to recommend learning resources and guide learning paths, highlighting their crucial role in personalized education.

# 5. RS Challenges for Education and Future Directions

The integration and use of RS in education introduce challenges and implications for theory and practice. We offer a brief overview of such challenges and implications that can provide insights for future directions in RS research.

## 5.1 Ethical and legal considerations for RS in education

RS aim to support stakeholders (in this case, teachers and learners) by providing suggestions on multiple levels that would address their individual needs. At the same time, such systems have been criticized for diminishing the **autonomy** and initiative of stakeholders to retrieve their own resources and information, undermining their **agency** and creating the feeling of loss of **control** {% cite chiu_systematic_2023 %}**.**

The generation of recommendations is tightly coupled with the data that recommendation algorithms have been trained upon. That is, in order for an RS to provide **fair** and **unbiased** - but at the same time, useful and helpful - recommendations, it should be trained on data that are complete and represent the target population accurately, and additionally, no bias has been introduced in later stages, such as through labeling or coding {% cite baker_algorithmic_2022 %}.

At the same time, we want to ensure equity while one of the main objectives of RS is to address learners’ individual needs. That is, RS should not widen existing gaps in terms of knowledge, but instead, take into account learning outcomes on higher levels {% cite holmes_equity_2022 %}.

Besides aspects of fairness and bias, the collection and use of users’ data - that can potentially be **private** or **sensitive** - raises questions and concerns as to how these data are collected, stored, and processed, for what purposes they are used, and whether or with whom these data are shared {% cite ramzan_privacy_2013 %}.

**Accountability** in RS is typically explored in relation to **transparency** and connects to aspects of **reproducibility** {% cite bellogin_improving_2021 %}. This means that, on the one hand, RS should deliver results that can be reproduced in order to ensure robustness and on the other hand, they should make visible the decision-making processes according to which they delivered these results and provide explanations that is understandable and useful for the users.

However, when it comes to education, the use of RS – and the potential of overriding their use, or ignoring system recommendations – has implications on aspects of accountability, and potentially **liability**, of educators and education institutions {% cite holmes_artificial_2022 %}.

## 5.2 Implications for Education and Future Directions

In the following, we provide a contextualized discussion regarding the use of RS for Education and potential research directions.

### 5.2.1 Recommendation accuracy vs. learners’ history

“_As a user’s history records accumulate, older records may be inconsistent with the user's new requests. Using all the available data indiscriminately jeopardizes prediction accuracy, and recommender systems that fail to take this into consideration run the risk of performance degradation_” {% cite zhang_artificial_2021 %}.

One may argue that the quality of recommendations we offer to a learner depends on the amount of information that we have about them, that is the more, the better! Nonetheless, one should also consider temporal aspects and contingencies of data generated by learners. For example, a topic of interest may change over time (for example, someone who was not particularly interested in math discovers

a new passion in algebra), context changes (a student who moves to a new school) and simply people evolving. This may suggest that older information is not (or should not be) as “important” for the RS as more recent information. However, what do we mean by “older” and “more recent” information? Is it 6 months new enough? And is 6 months new enough for everyone?

Developing methods – potentially combining the use of AI and learner modeling – that determine the temporal relevance of learners’ data in order to improve recommendations would allow modern RS to take advantage of context and to support personalization for life-long learning.

### 5.2.2 Recommendation Algorithms vs. Pedagogy

The first instances of recommender systems were developed in domains focusing on information filtering, including news recommendations, music, and video recommendations, as well as e-commerce recommendations {% cite dong_brief_2022 %}. The latter of which was then one of the main drivers of advancing the development of RS algorithms, models, and approaches. RSs that were developed for educational purposes were relatively influenced by those methods, if not completely adopting them. This raises the question about the strength of the pedagogical foundation of the development of modern RS approaches, and how fitting the common RS are for a learning setting. Take collaborative filtering for example, if this approach is implemented in a classroom, can one say that it is correct to recommend a student certain exercises, only because other students in the classroom (similar students) have solved these exercises? Although this might be correct in some cases, it is clear that the original concept of collaborative filtering was not based on the pedagogical requirement of how students in the same classroom should solve exercises.

To that end, one can argue that solid pedagogy foundations, i.e., learning theories, are not the main source of influence on the development of most types of recommender systems. This, of course, does not mean that no RS were designed based on learning theories. However, the most common RS approaches may still arguably follow a commercial logic, rather than a logic that is strongly founded in pedagogy.

### 5.2.3 Recommendations & personalization

_“Another risk of using “learning with AI” tools is that, while they offer personalized recommendations for each student’s learning path, they still lead everyone to the same fixed learning outcomes”_ {% cite holmes_artificial_2019 %}. This approach may work well in K-12 education, where all students are required to obtain fundamental knowledge. However, it is risky for adult learning as well as more open forms of education such as MOOCs, where students often have different learning goals. For example, a working professional might follow an introductory course on statistics to be able to provide insightful analyses for their job. This student does not need as a learning outcome an in-depth coverage of the foundations of probabilities and normal distribution. Ideally, the recommender system should be sufficiently adaptable and personalized to not overwhelm students with unnecessary information assuming a one-fits-all learning goal.

Building on our previous points, the more information (i.e., data) we have about a student the better the recommendation we can provide. However, while personalization increases relevance it also carries the risk of overfitting. In other words, recommendations can become too narrow and focused which leads to keeping the students on a predetermined path, also known as the _‘Lemming effect’_. This effect can “trap” the student’s performance in a cycle. For example, data from a student performing poorly may lead to recommendations of material for poor-performing students limiting the exposure to more challenging material that could stimulate growth and provoke curiosity. Therefore, balancing personalization with diverse learning recommendations is essential for optimal learning.

### 5.2.4 Recommendations vs. privacy

As data driven systems, the more explicit and specific data RS have about the user and the items to be recommended, the better their chances are to generate a better, more tailored recommendation for the user. This raises the question: how much data is too much data? In terms of collecting data that a user considers as private, and perhaps does not prefer to be collected. In this situation, it is the user's privacy that needs to be prioritized, but if that affects the performance of the recommender system, who, and how should the compromise be made?

This situation is becoming more and more critical at the moment, due to the availability of tools to collect more data about the user, such as sensory devices to monitor the student’s eye movement, of their ECG signals, etc., to detect their level of attention and engagement.

While such information might be useful, it does pose a potential violation of the student’s privacy, or at least may not be comfortable for the student being observed at this level.

To that end, a potential approach to solve this problem is to enhance the **transparency** of the RS by clarifying to the end users the data they are collecting and the way this data is used, as well as ensuring the user’s agency over the decision of sharing certain data with the RS which has a direct effect on the learner’s autonomy in the learning setting.

Guaranteeing that the student, especially at an early age, is capable of understanding the privacy-implications and the criticality of sharing their data with the RS shows a need for a user-friendly design of consent forms, as well as a certain level of digital literacy, that enables the student of making an informed decision about the level of privacy they want to keep while using a recommender system.
