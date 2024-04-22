---
title: "How to clean a git history of unwanted data"
description: What if you accidentally left your personal data in a Git repository?
date: 2023-09-18
draft: true
---

Git is a version control system that allows you to describe the development of your project as a logical chain, keeping track of all changes. Imagine that you accidentally left personal data, tokens, passwords, etc. in your Git history. In this article I will tell you how to remove them.

## BFG Repo-Cleaner

Suitable when it comes to replace one string with another. It does not affect file names.

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Create file `replace.txt` with content:

```txt
databasePasswordCIkXqRMO==>password123
+79874379141==>+798xxxxxxxx
regex:(?i)Solinnen(?-i)==>Matthew
```

Where `databasePasswordCIkXqRMO` is a string that BGF will try to find and `password123` is the string to replace the original with. You can also use regexp here.

3. Run command
```bash
java -jar bfg-1.14.0.jar -rt replace.txt /path/to/git/repo
```

Don't forget to force push.

## Change commits metadata

Suitable when you have commits with unwanted email and author name.

```bash
git filter-branch -f --env-filter "
    GIT_AUTHOR_NAME='Beronika Solinnen'
    GIT_AUTHOR_EMAIL='solinnen@proton.me'
    GIT_COMMITTER_NAME='Beronika Solinnen'
    GIT_COMMITTER_EMAIL='solinnen@proton.me'
  " HEAD
```

This will replace email and author name with provided data. Don't forget to force push.

## Delete a certain file from history

```bash
git filter-branch --index-filter 'git rm -rf --cached --ignore-unmatch path_to_file' HEAD
```


## Delete whole commit history

If your base branch is called `main`:
```bash
git checkout --orphan latest_branch
git add -A
git commit -am "Initial Commit"
git branch -D main
git branch -m main
git prune -v
git push -f origin main
```

If your base branch is called `master`:
```bash
git checkout --orphan latest_branch
git add -A
git commit -am "Initial Commit"
git branch -D master
git branch -m master
git prune -v
git push -f origin master
```