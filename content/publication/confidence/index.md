---
title: Shapley Value Confidence Intervals for Attributing Variance Explained
authors:
  - Danny Fryer, PhD
  - Inga Strumke
  - Hien Nguyen
date: 2020-10-14T00:00:00Z
summary: Under a weak assumption that the joint distribution is pseudo-elliptical, we obtain the asymptotic normality of the Shapley values.
abstract: The coefficient of determination, the R2, is often used to measure the variance explained by an affine combination of multiple explanatory covariates. An attribution of this explanatory contribution to each of the individual covariates is often sought in order to draw inference regarding the importance of each covariate with respect to the response phenomenon. A recent method for ascertaining such an attribution is via the game theoretic Shapley value decomposition of the coefficient of determination. Such a decomposition has the desirable efficiency, monotonicity, and equal treatment properties. Under a weak assumption that the joint distribution is pseudo-elliptical, we obtain the asymptotic normality of the Shapley values. We then utilize this result in order to construct confidence intervals and hypothesis tests for Shapley values. Monte Carlo studies regarding our results are provided. We found that our asymptotic confidence intervals required less computational time to competing bootstrap methods and are able to exhibit improved coverage, especially on small samples. In an expository application to Australian real estate price modeling, we employ Shapley value confidence intervals to identify significant differences between the explanatory contributions of covariates, between models, which otherwise share approximately the same R2 value. These different models are based on real estate data from the same periods in 2019 and 2020, the latter covering the early stages of the arrival of the novel coronavirus, COVID-19.
image:
  caption: Map of Melbourne suburbs included in the study
---

Code and data can be found on the project repository [(click here)](https://github.com/ex2o/shapley_confidence).
