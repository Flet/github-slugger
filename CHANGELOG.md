# github-slugger change log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 2.0.0 2022-10-27
* Use ESM
  **breaking**: please read [this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
* Add types
  **breaking**: tiny chance of breaking, use a new version of TS and it’ll work

## 1.5.0 2022-10-25
* Update Unicode to 13, to match GH

## 1.4.0 2021-08-24
* Fix to match GitHub’s algorithm on unicode

## 1.3.0 2020-02-21
* Expose static slug function for folks who do not want/need the stateful bits (Thanks [@bobbylito](https://github.com/bobylito)!).

## 1.2.1 2019-xx-xx
* Fix collisions for slugs with occurrences
* Fix accessing `Object.prototype` methods
* Fix Russian
* Add `files` to package.json

## 1.2.0 2017-09-21
* Add `maintainCase` support

## 1.1.3 2017-05-29
* Fix`emoji-regex` semver version to ensure npm5 compatibility.

## 1.1.2 2017-05-26
* Lock down `emoji-regex` dependency to avoid [strange unicode bug](https://github.com/Flet/github-slugger/issues/9)

## 1.1.1
* Add more conformant unicode handling to ensure:
   - emoji are correctly stripped
   - non-Latin characters are not incorrectly lowercased
* Also adds more verified test cases

Check the [PR](https://github.com/Flet/github-slugger/pull/8) for more details!

Thanks [@wooorm](https://github.com/wooorm)!

## 1.1.0
* Feature: Support for non-latin characters in slugs https://github.com/Flet/github-slugger/pull/3) Thanks [@tadatuta](https://github.com/tadatuta)!

## 1.0.1
* Fix: bug for multiple empty slugds (https://github.com/Flet/github-slugger/pull/1) Thanks [@wooorm](https://github.com/wooorm)!
