<?php
namespace lib;

/**
* 
*/
class staticFiles
{

	
	function __construct($mode, $domain, $theme, $page)
	{
		# code...
	}

	function load()
	{
		$res['static_bundle'] = 'a';
		$res['static_js'] = 'js';
		$res['static_css'] = 'css';
		return $res;
	}
}
