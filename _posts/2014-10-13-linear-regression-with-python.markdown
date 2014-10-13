---
layout: post
title: Linear regression with Python
published: true
categories:
---

As part of my coursework at Maastricht University we were tasked with running linear regressions of the performance of mutual funds against the performance of the market as a whole. This could have been done in excel, but with 653 different funds to run it would have taken hours. With the power of python, pandas and statsmodels the time taken was shortened dramatically.

What we have: 

	– Raw return data for 653 mutual funds.

What we need: 

	– The fund’s alpha 
	– The coefficients for each factor of the Carhart four-factor model

Other good to haves: 

	– The r-squared value of the model (how does it fit) 
	– The p values of each factor

Import the required packages:

{% highlight python %}
import numpy as np
import pandas
import matplotlib.pylab as plt
from matplotlib import lines as mpl_lines
from operator import sub
from statsmodels.formula.api import ols
from matplotlib.backends.backend_pdf import PdfPages
{% endhighlight %}

Import the data from CSV:

{% highlight python %}
data = pandas.read_csv('large.csv', index_col='Date')
{% endhighlight %}

Setup a pandas DataFrame which will be used to store results of the regression analysis.

{% highlight python %}
index= ['Alpha', 'Alpha P-Value', 'Market Beta', 'Market P-Value', 'SMB Beta', 'SMB P-Value', 'HML Beta', 'HML P-Value', 'MOM Beta', 'MOM P-Value', 'R-Squared']
results = pandas.DataFrame(index=index)
{% endhighlight %}