# Documentation

## Prerequisites

- pdflatex
  - --shell-escape
- markdown package (https://www.overleaf.com/learn/latex/Articles/How_to_write_in_Markdown_on_Overleaf)

## Set Up

### Main file

pdf_doc.tex

all sections included

```latex
%Name of Section
\include{nameoffile}
```

### Header/Footer

The Header and Footer are created using the fancyhdr package.
In Main File:

```latex
% Header & Footer
\pagestyle{fancy}
\fancyhf{}
\lhead{PA - 2018}
\chead{ZHAWo}
\rhead{\theauthor}
\lfoot{}
\cfoot{\thepage}
\rfoot{}
```

### Sections

A new .tex file is created for each section.
Example Code -> test.tex:

```latex
\begin{markdown}

# Test title
some text
## Testing tex commands

\blindtext
\cite{DUMMY}

\end{markdown}
```

You can use both latex and Markdown syntax.

## MD Files

If needed MD files can be included.

```latex
\markdownInput{example.md}
```

## Bibliography

Current Cition Style: ieee
change in Main File:

```latex
\usepackage[backend=bibtex,style=ieee]{biblatex}
```

Sources are added to source.bib using the BibTeX Format:
**Book**:

```
@BOOK{DUMMY,
AUTHOR="John Doe",
TITLE="The Book without Title",
PUBLISHER="Dummy Publisher",
YEAR="2100",
}
```

**Website** and **multiple authors**:

```
@online{OurReadme,
  author = {Bachmann, Dominik and Visser, Julian},
  title = {{Readme}},
  year = 2018,
  url = {https://github.com/zhaw-timetable/zhawo},
  urldate = {2018-12-10}
}
```

Reference the source:

```latex
\cite{DUMMY}
\cite{OurReadme}
```
