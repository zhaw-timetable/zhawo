# Documentation

## Prerequisites

- pdflatex
  - --shell-escape
- markdown package (https://www.overleaf.com/learn/latex/Articles/How_to_write_in_Markdown_on_Overleaf)

### How to install Latex

Osx : [Install Latex](https://sourabhbajaj.com/mac-setup/LaTeX/)

Windows: [Install Latex](https://miktex.org/download)

### Vscode

Install [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop).

Add to settings:

```
"latex-workshop.latex.tools": [
    {
      "name": "latexmk",
      "command": "latexmk",
      "args": [
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "-pdf",
        "-outdir=%OUTDIR%",
        "%DOC%"
      ],
      "env": {}
    },
    {
      "name": "pdflatex",
      "command": "pdflatex",
      "args": [
        "--shell-escape",
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "%DOC%"
      ],
      "env": {}
    },
    {
      "name": "bibtex",
      "command": "bibtex",
      "args": ["%DOCFILE%"],
      "env": {}
    }
  ],
  "latex-workshop.view.pdf.viewer": "tab"
```

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
\includegraphics[width=4cm]{./assets/zhawoLogo.png}

% float --> left/right/center (\usepackage[export]{adjustbox})
\includegraphics[left]{./assets/zhawoLogo.png}

% image with citation
\begin{figure}[H]
  \includegraphics[width=4cm, center]{./assets/zhawoLogo.png}
  \caption{\textsf{Our Logo{\cite{OurReadme}}}}
\end{figure}
```

Use textsf so label use san serif font

cross-references

```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=0.25\textwidth]{mesh}
    \caption{a nice plot}
    \label{fig:mesh1}
\end{figure}

As you can see in the figure \ref{fig:mesh1} % adds figure number
```

https://www.overleaf.com/learn/latex/Inserting_Images

## Quotes

Typing quotations with this package is quite easy:

```latex
\say{Here, a quotation is written and even some \say{nested} quotations
are possible}
```

https://www.overleaf.com/learn/latex/Typesetting_quotations

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

https://www.latex-tutorial.com/tutorials/bibtex/

## Font

Chnage Font default = Computer Modern

```latex
\usepackage[sfdefault]{roboto}  %% Option 'sfdefault' = base font, fallback
\usepackage[T1]{fontenc}
```

Find supported fonts:
http://www.tug.dk/FontCatalogue/

## Include pdfpages

```latex
\usepackage{pdfpages}
```

This will insert the first page of external.pdf without numbering the inserted page.

```latex
\includepdf{external.pdf}
```

If you want to the inserted page to have a page number add the option pagecommand={}. With this option, the command will be:

```latex
\includepdf[pagecommand={}]{external.pdf}
```

To insert specific pages, say pages 2, 4, and 7, use:

```latex
\includepdf[pages={2, 4, 7}, pagecommand={}]{external.pdf}
```

To insert a range of pages, say pages 9 through 13, use:

```latex
\includepdf[pages={9-13}, pagecommand={}]{external.pdf}
```
