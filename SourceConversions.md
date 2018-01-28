# BlockChat Coding Style and Conversions

This file has the coding style and conversions that will be used by the BlockChat Developers. The aim is to make
sure that the code is readable and easy to follow.

This file was adopted from the one by HOOMD, that can be found [here](https://bitbucket.org/glotzer/hoomd-blue/src/1e86eec959eb039de52903e08333a4dc7d5af903/SourceConventions.md?at=maint&fileviewer=file-view-default)

## Naming

* Naming of directory, files and class names should be named with intuitive using PascalCase.
* Similary, local variable names should use camelCase
* Constansts should be named using ALLCAPS, with an underscore in between words, e.g. 

```
GRAVITATIONAL_CONSTANT
```

## Indentation
* Tabs not spaces are used to indent lines.
* A single level of indentation is to be 4 spaces
* There should be no whitespace at the end of lines in the file.
* The indentation style used is [Allman style](https://en.wikipedia.org/wiki/Indentation_style#Allman_style).
An extended set of examples follows:

```cpp
class SomeClass
    {
    public:
        SomeClass();
        int SomeMethod(int a);
    private:
        int m_some_member;
    };

// indent function bodies
int SomeClass::SomeMethod(int a)
{
    // indent loop bodies
    while (condition)
    {
        b = a + 1;
        c = b - 2;
    }

    // indent switch bodies and the statements inside each case
    switch (b)
    {
        case 0:
            c = 1;
            break;
        case 1:
            c = 2;
            break;
        default:
            c = 3;
            break;
    }

    // indent the bodies of if statements
    if (something)
    {
        c = 5;
        b = 10;
    }
     else if (something_else)
    {
        c = 10;
        b = 5;
    }
     else
    {
        c = 20;
        b = 6;
    }

    // omitting the braces is fine if there is only one statement in a body (for loops, if, etc.)
    for (int i = 0; i < 10; i++)
        c = c + 1;

    return c;
    // the nice thing about this style is that every brace lines up perfectly with it's mate
}
```

* Documentation comments and items broken over multiple lines should be aligned with spaces
```cpp
class SomeClass
    {
    private:
        int m_some_member;        //!< Documentation for some_member
        int m_some_other_member;  //!< Documentation for some_other_member
    };

template<class BlahBlah> void some_long_func(BlahBlah with_a_really_long_argument_list,
                                             int b,
                                             int c);
```

## Formatting Long Lines
* All code lines should be hand-wrapped so that they are no more than 120 characters long
* Simply break any excessively long line of code at any natural breaking point to continue on the next line

```cpp
cout << "This is a really long message, with "
     << message.length()
     << "Characters in it:"
     << message << endl;
```

* Try to maintain some element of beautiful symmetry in the way the line is broken. For example, the above long message
is preferred over the below:

```cpp
cout << "This is a really long message, with " << message.length() << "Characters in it:"
   << message << endl;
```

* There are special rules for function definitions and/or calls
* If the function definition (or call) cleanly fits within the 120 character limit, leave it all on one line

```cpp
int some_function(int arg1, int arg2)
```

* If the function doesn't have a template specifier, or splitting at that point isn't enough, split out each argument
onto a separate line and align them.

```cpp
// go from
int some_really_long_function_name(int with_really_long_arguments, int or, int maybe, float there, char are, int just, float a, int lot, char of, int them)
// to
int some_really_long_function_name(int with_really_long_arguments,
                                   int or,
                                   int maybe,
                                   float there,
                                   char are,
                                   int just,
                                   float a,
                                   int lot,
                                   char of,
                                   int them)
```

## Documentation and Comments

* Use comments liberally but the code must be the comments, and use the [Doxygen style
(https://www.stack.nl/~dimitri/doxygen/manual/docblocks.html).
* Every class, member variable, function, function parameter, macro, etc. MUST be documented with doxygen comments.
* If you copy an existing file as a template, DO NOT simply leave the existing documentation comments there. They
apply to the original file, not your new one!
* The best advice that can be given is to write the documentation comments FIRST and the actual code second. This
allows one to formulate their thoughts and write out in English what the code is going to be doing. After thinking
through that, writing the actual code is often much easier, plus the documentation left for future developers to read
is top-notch.
* Good documentation comments are best demonstrated with an in-code example. See in particular the long section in
TablePotential.h where the all the details about the calculation and data layout were specified before even a single
line of code was written.

* Files: each file must have a comment at the top, e.g. 

```cpp
// Copyright (c) 2018 BlockChat

// Maintainer: Felix Madutsa

/*! \file UserProfile.cpp
    \brief Defines the class that holds the data of users
*/
```

* Classes: each class should have a description at the top, e.g. 
```cpp
//! Top level description
/*! Implements ...
*/
```

* Functions and methods: each function or method should have a description at the top. The params should be listed in the order in which they appear in the function signature. As such, do not comment each line of code in the function since the description should provide a good overview of what is going on in the function. Only use comments in function when it is absolutely neccesary, e.g. 
```cpp
/*! 
\param
\param 

Implements ...
*/
```

## General

* Do not perform premature optimizations that would compromise code-readability
* Test the validity of arguments received from outside a class
* Make sure that every switch statement has a default case handled
* Try to handle errors gracefully as opposed to crashing the system