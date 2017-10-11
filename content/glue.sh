#!/bin/sh
# constants
css_name='style'
js_name='scripts'
html_name='templates'
exst=('js' 'css')
app=('sys' 'app' 'win')
lib=('conf' 'lib/ractive')
place=('app' 'lib')

# clear old
rm _glued -r
mkdir _glued
mkdir _glued/app
mkdir _glued/app/assets
mkdir _glued/app/assets/img
mkdir _glued/lib
echo 'cleared _glued...'

# process
for pl in ${place[@]}; do
  if [[ "app" == "$pl" ]]; then placies=(${app[@]}); else placies=(${lib[@]}); fi
  for ext in ${exst[@]}; do
    f=''
    i=''
    for fold in ${placies[@]}; do
      t=`find $fold/ -type f -name "*.$ext"`
      f="$f $t"
      if [[ 'css' == "$ext" ]]; then
        t=`find $fold/ -type f -path "*assets/img/*"`
        i="$i $t"
      fi
    done

    if [[ 'lib' == "$pl" && 'js' == $ext ]]; then
      f="$f helper.js lang/lang.js"
    fi
    if [[ 'app' == "$pl" && 'js' == $ext ]]; then
      f="$f init.js"
    fi

    if [[ 'app' == "${placies[1]}" ]]; then p='app'; else p='lib'; fi

    if [[ 'css' == "$ext" ]]; then n=$css_name;
    elif [[ 'js' == "$ext" ]]; then n=$js_name;
    fi

    _file="_glued/$p/$n.$ext"

    for file in $f
    do
      if [[ 0 == `expr match "$file" '.*_example_.*'` && 0 == `expr match "$file" '.*ractive.js.*'` ]]; then
        echo "Processing $file"
        echo "/*** ${file} ***/" >> "$_file"
        cat ${file} >> "$_file"
        echo -e "\n" >> "$_file"
      fi
    done
    if [[ 'css' == "$ext" ]]; then
      _file_i="_glued/$p/assets/img/"
      for file in $i
      do
        echo "Copy $file"
        cp $file $_file_i
      done
    fi
  done

  if [[ "app" == "$pl" ]]; then
    ext='html'
    f=''
    for fold in ${placies[@]}; do
      t=`find $fold/ -type f -name "*.$ext"`
      f="$f $t"
    done

    p='app'
    n=$html_name

    _file="_glued/$p/$n.$ext"

    for file in $f
    do
      if [[ 0 == `expr match  "$file" '.*index.html.*'` && 0 == `expr match  "$file" '.*_example_.*'` ]]; then
        echo "Processing $file"
        echo "<!!!>${file}<!:!>" >> "$_file"
  #      echo -e "\n" >> "$_file"
        cat ${file} >> "$_file"
        echo "" >> "$_file"
      fi
    done
  fi
done
