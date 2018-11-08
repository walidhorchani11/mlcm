#!/bin/bash

URL1=$1
URL2=$2
URL3=$3
URL4=$4
pdfname=$5
idRev=$6
idPres=$7
rcpList=$8
d=$(date +%s)
tmpDir=/tmp/pdf/$idPres-$idRev
tmp=$tmpDir/$pdfname
mkdir -p $tmpDir
cd /home/argo/Bureau/mcm-merck/decktape
./phantomjs --disk-cache=true decktape.js -p 0 --slides 1 $URL1 $tmp-1.pdf
if [ "$URL2" != "null" ]; then
./phantomjs --disk-cache=true decktape.js -p 0 --slides 1 $URL2 $tmp-2.pdf
pdfunite $tmp-1.pdf $tmp-2.pdf $tmp.pdf
rm -f $tmp-1.pdf $tmp-2.pdf
mv $tmp.pdf $tmp-1.pdf
fi
./phantomjs --disk-cache=true decktape.js reveal $URL3 $tmp-2.pdf
if [ "$URL4" != "null" ]; then
./phantomjs --disk-cache=true decktape.js -p 0 reveal $URL4 $tmp-3.pdf
pdfunite $tmp-2.pdf $tmp-3.pdf $tmp.pdf
rm -f $tmp-2.pdf $tmp-3.pdf
mv $tmp.pdf $tmp-2.pdf
fi
#Add numbering to page
pspdftool "number(x=645 pt, y=10 pt, start=1, size=13, font=\"LiberationSerif-Italic\" )" $tmp-2.pdf $tmp-2.pdf
#Add RCP Lists
if [ "$rcpList" != "null" ]; then
rcpListName=$tmp$d.pdf
rcpListName1=$tmp$d"_pdf.pdf"
rcpListName2=$tmp$d"_AllPDF.pdf"
titlePdfName=$tmp$d"_title_pdf.pdf"
pdf_number=0

for row in $(echo "${rcpList}" | jq -r '.[] | @base64'); do
    _jq() {
     echo ${row}  | base64 --decode | jq -r ${1}
    }
convert -size 1280x600 -gravity center label:$(_jq '.title') $titlePdfName
wget -c $(_jq '.url') -O $rcpListName1
if [ "$pdf_number" = 0 ]; then
pdfunite $titlePdfName $rcpListName1 $rcpListName
pdf_number=1
else
pdfunite $rcpListName $titlePdfName $rcpListName1 $rcpListName2
mv $rcpListName2 $rcpListName
fi
rm -f $titlePdfName $rcpListName1
done
pdfunite $tmp-1.pdf $tmp-2.pdf $rcpListName $tmp.pdf
rm -f $tmp-1.pdf $tmp-2.pdf $rcpListName
else
pdfunite $tmp-1.pdf $tmp-2.pdf $tmp.pdf
rm -f $tmp-1.pdf $tmp-2.pdf
fi

aws s3 cp $tmp.pdf s3://argolife-mcm-export/pdf/$idPres-$idRev/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
rm -f $tmp.pdf