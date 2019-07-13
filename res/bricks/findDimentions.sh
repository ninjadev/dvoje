#!/bin/bash

for f in *.png; do
HEIGHT=`sips -g pixelHeight $f | tail -n1 | cut -d" " -f4`
WIDTH=`sips -g pixelWidth $f | tail -n1 | cut -d" " -f4`
echo "{file:\"$f\",width:$WIDTH,height:$HEIGHT}"
done

