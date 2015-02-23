var divPistes = $("#listePiste");
var groupeBoutonPiste = '<span class="pull-right">' + 
							'<button class="btn btn-sm">' +
								'<span class="glyphicon glyphicon-volume-off"></span>'+
							'</button> '+ 
							'<button class="btn btn-sm">' +
								'<span class="glyphicon glyphicon-headphones"></span>'+
							'</button>'+
						'</span>';

$(document).ready(function(){
	divPistes.append('<a href="#" class="list-group-item clearfix">Track 1' + groupeBoutonPiste + '</a>');
	divPistes.append('<a href="#" class="list-group-item clearfix">Track 2' + groupeBoutonPiste + '</a>');
});

$("btn btn-sm > .glyphicon glyphicon-volume-off").click(function(){
	$(this).toggleClass("active");
});
