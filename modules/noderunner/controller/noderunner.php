<?php

namespace Phresto\Modules\Controller;
use Phresto\Controller;
use Phresto\ModelController;
use Phresto\Config;
use Phresto\View;
use Phresto\Modules\Model\nodecode;

/** 
* Tool to make testing your application easier
*/
class noderunner extends Controller {

	const CLASSNAME = __CLASS__;
	protected $routeMapping = ['run_post' => ['code' => 0]];
	protected $webtaskUrl = 'https://wt-94fe49a9fc27036c2c94cee1aa2eda15-0.run.webtask.io/noderunner';

	/** 
	* returns explorer's UI
	* @return html
	*/
	protected function get() {
		$view = View::getView( 'main', 'noderunner' );
		$view->add( 'main', [], 'noderunner' );

		return $view->get();
	}

	/** 
	* runs node.js code
	* @return json
	*/
	public function run_post($code) {
		$nodecode = new nodecode();
		$nodecode->code = $code;
		$nodecode->save();

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->webtaskUrl . '?codeid=' . $nodecode->getIndex());
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER , 1);

		$result = curl_exec($ch);

		curl_close($ch);

		$nodecode->delete();
		return View::jsonResponse( ['result' => $result] );
	}

}