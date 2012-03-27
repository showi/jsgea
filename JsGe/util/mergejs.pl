#!/bin/perl

use strict;

my $htm = "../s.htm";
my $path = "../";
my $fout = "GeJsMerge.js";
my $del_comment = 1;
my $del_emptyline = 1;
my $del_ws = 1;

my $ls = '-'x80 . "\n";

print $ls;
print " Merging javascript sources\n";
print $ls;

my $fh;
open($fh, $htm) 
	or die "Cannot open file $htm";
my $out = "";
my @buffer;
while(<$fh>) {
	/^\s*<script\s*src="\s*(.*)\s*"\s*>/ and do {
		my $js = $1;
		$js !~ /^(src).*/ and next;
		my $fh2;
		print "Appending $js\n";
		open($fh2, "$path$js") 
			or die "Cannot open javascript file: '$js'";
		#$out .= "\/\/----- ---[$js]--- -----\n";
		my $sc = 0;
		while(my $l = <$fh2>) {
			clean_line(\$out, $l, \$sc);
		}
		next;
	}
}

open($fh, ">$path$fout")
	or die "Cannot open out file '$path$fout'";
# for(@buffer) {
	# my $l = $_;
	# #print $l;
	# #$l =~ s/\n//sg;
	# print $fh $l;
# }
$out =~ s/\r/\n/gs;
#$out =~ s/\s+/ /gs;
print $fh $out;
print "\n";
print "Javascript files merged\n";
print $ls;

sub clean_line {
	my $rout = shift;
	my $line = shift;
	my $rsc = shift;
	$line =~ s/^\s*(.*)\s*$/$1/;
	$line =~ /^\s*$/ and next;
	$line =~ s/^\s+/ /g;
	if ($$rsc) {
		$line =~ /^\s*.*\*\/\s*(.*)\s*$/ and do {
			my $tok = "$1";
			$$rsc = 0;
			$tok = /^\s*$/ and return;
			$$rout .= "$tok\n";
			push @buffer, "$tok\n";
		};
		return;
	}
	$line =~ /^\s*(.*)\s*\/\*.*\*\/\s*(.*)\s*$/ and do {
		my $tok = "$1$2";
		$tok = /^\s*$/ and return;
		$$rout .= "$tok\n";
		push @buffer, "$tok\n";
		return;
	};
	$line =~ /^(.*)\/\/.*$/ and do {
		$1 =~ /^\s*$/ and return;
		$$rout .= "$1\n";
		push @buffer, "$1\n";
		return;
	};
	$line =~ /^\s*(.*)\s*\/\*.*$/ and do {
		my $tok = "$1";
		$$rsc = 1;
		$tok = /^\s*$/ and return;
		$$rout .= "$tok\n";
		push @buffer, "$tok\n";
		return;
	};
	$$rout .= "$line\n";
	push @buffer, $line;
}