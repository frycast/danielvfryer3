---
title: "Model independent feature attributions: Shapley values that uncover non-linear dependencies"

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here 
# and it will be replaced with their full name and linked to their profile.
authors:
- admin
- Inga Strumke
- Hien Nguyen

# Author notes (optional)
#author_notes:
#- "Equal contribution"
#- "Equal contribution"

date: "2020-10-14T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
#publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["3"]

# Publication name and optional abbreviated publication name.
#publication: In *Wowchemy Conference*
#publication_short: In *ICW*

abstract: Shapley values have become increasingly popular in the machine learning literature,
thanks to their attractive axiomatisation, flexibility, and uniqueness in satisfying certain
notions of `fairness'. The flexibility arises from the myriad potential forms of the
Shapley value game formulation. Amongst the consequences of this flexibility is that
there are now many types of Shapley values being discussed, with such variety being
a source of potential misunderstanding. To the best of our knowledge, all existing
game formulations in the machine learning and statistics literature fall into a category,
which we name the model-dependent category of game formulations. In this work, we
consider an alternative and novel formulation which leads to the first instance of what
we call model-independent Shapley values. These Shapley values use a measure of nonlinear
dependence as the characteristic function. The strength of these Shapley values is
in their ability to uncover and attribute non-linear dependencies amongst features.
We introduce and demonstrate the use of the energy distance correlations, affine invariant
distance correlation, and Hilbert-Schmidt independence criterion as Shapley
value characteristic functions. In particular, we demonstrate their potential value for
exploratory data analysis and model diagnostics. We conclude with an interesting
expository application to a medical survey data set.

# Summary. An optional shortened abstract.
summary: In this work, we consider an alternative and novel formulation which leads to the first instance of what
we call model-independent Shapley values.

# tags:  

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
# links:
# - name: Custom Link
#   url: http://example.org

url_pdf: ''
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Comparing characteristic functions'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---

{{% callout note %}}
Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/).
