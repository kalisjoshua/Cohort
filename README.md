# Cohort

Doing things is tedious. Humans are bad at doing tedious things because we get bored and make mistakes. Computers are good at doing repetitive tasks because they don't get bored and do everything they are told to do. Building source files into a distributable set of files is something that is tedious and needs to be done consistently between developers of a project so why not let the computer do some of that work for you?

Cohort is an attempt to alleviate most of the this work for the developer. Simply define the procedures to perform to achieve a complete build of a project. The focus of Cohort is the simplicity of the setup; no programming should be necessary by the developer, beyond what they would have to do without a tool such as Cohort. The goal is for Cohort to be a drop-in helper to most projects; if you are using a Cakefile for compiling your Coffeescript you wont need to duplicate any of that in Cohort because the Cakefile will just be executed by Cohort instead of you.

Cohort is meant to be a companion to you and your chosen development environment with a single purpose; to create a "build" of your source files. Therefore if it is unable to complete a task it should fail outright and not try and continue; this also means that Cohort should not make itself a route to attempt a "partial build" of a project.
