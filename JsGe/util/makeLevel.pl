#!/usr/bin/perl -w

use strict;

use JSON;

my $path = "../level/";

my $ls = '-'x10 . " " . '-'x5 . " " .'-'x10 . "\n";

my $json = JSON->new->allow_nonref;
 
sub find_level {
	my $path = shift;
	my $dh;
	opendir($dh, $path) 
		or die "Cannot open directory $path";
	while(my $d = readdir($dh)) {
		next if $d =~ /^\.(\.)?$/;
		print $ls;
		print "dir: $d\n";
		my %data  = (
			name => $d,
		);
		gather_level_data("$path$d", \%data);
	}
}


sub gather_level_cells {
	my $p_path = shift;
	my $r_data = shift;
	my $dh;
	my $path = "$p_path/cells/";
	opendir($dh, $path) 
		or die "Cannot open directory $path";
	while(my $d = readdir($dh)) {
		next if $d =~ /^\.(\.)?$/;
		#$r_data->{name} = $d;
		print "$d\n";
		$d =~ /^(\d+)-(\d+)-([\w\d]+)(-(\d+))?\.([\w\d]+)$/ and do {
			#print "$1 $2 $3 $5 $6\n";
			$r_data->{cells}->[$1][$2]->{filename} = $d;
			$r_data->{cells}->[$1][$2]->{type} = 3;
			$r_data->{cells}->[$1][$2]->{filext} = $6;
			if ($5) {
				$r_data->{cells}->[$1][$2]->{layer} = $5;
			}
			for my $k(keys %{$r_data->{cells}->[$1][$2]}) {
				print "\t$k: " . $r_data->{cells}->[$1][$2]->{$k} . "\n";
			}
			print $json->encode($r_data);
		}
	}
}
sub gather_level_data {
	my $path = shift;
	my $r_data = shift;
	gather_level_cells($path, $r_data);
}


# MAIN
find_level($path);