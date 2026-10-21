---
title: "Model independent feature attributions: Shapley values that uncover non-linear dependencies"
authors:
  - Danny Fryer, PhD
  - Inga Strumke
  - Hien Nguyen
date: 2020-10-14T00:00:00Z
summary: In this work, we consider an alternative and novel formulation which leads to the first instance of what we call model-independent Shapley values.
abstract: Shapley values have become increasingly popular in the machine learning literature, thanks to their attractive axiomatisation, flexibility, and uniqueness in satisfying certain notions of `fairness'. The flexibility arises from the myriad potential forms of the Shapley value game formulation. Amongst the consequences of this flexibility is that there are now many types of Shapley values being discussed, with such variety being a source of potential misunderstanding. To the best of our knowledge, all existing game formulations in the machine learning and statistics literature fall into a category, which we name the model-dependent category of game formulations. In this work, we consider an alternative and novel formulation which leads to the first instance of what we call model-independent Shapley values. These Shapley values use a measure of nonlinear dependence as the characteristic function. The strength of these Shapley values is in their ability to uncover and attribute non-linear dependencies amongst features. We introduce and demonstrate the use of the energy distance correlations, affine invariant distance correlation, and Hilbert-Schmidt independence criterion as Shapley value characteristic functions. In particular, we demonstrate their potential value for exploratory data analysis and model diagnostics. We conclude with an interesting expository application to a medical survey data set.
image:
  caption: Comparing characteristic functions
---

Code and data can be found on the project repository [(click here)](https://github.com/ex2o/sunnies).
