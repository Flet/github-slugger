# github-slugger change log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
