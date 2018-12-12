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
Add ref to the root file to each section so that build on save works from the sections.

```latex
% !TEX root = pa_doc.tex
```

Example Code -> test.tex:

```latex
% !TEX root = pa_doc.tex
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

## Images

Images are placed in the _assets_ folder.

```latex
% Added as is and placed by latex
\includegraphics{./assets/zhawoLogo.png}

% width/height
\includegraphics[width=0.4cm]{./assets/zhawoLogo.png}

% float --> left/right (\usepackage[export]{adjustbox})
\includegraphics[left]{./assets/zhawoLogo.png}
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
