<?php

namespace Phresto\Modules\Controller;
use Phresto\Controller;
use Phresto\ModelController;
use Phresto\Config;
use Phresto\View;
use Phresto\Modules\Model\nodecode;

/** 
* Node.js code runner controller
*/
class noderunner extends Controller {

	const CLASSNAME = __CLASS__;
	protected $webtaskUrl = 'https://wt-94fe49a9fc27036c2c94cee1aa2eda15-0.run.webtask.io/noderunner';

	/** 
	* returns explorer's UI
	* @return html
	*/
	protected function get() {
		$view = View::getView( 'main', 'noderunner' );
		$view->add( 
			'main', 
			[ 
				'webtaskCode' => file_get_contents(__DIR__ . '/../webtask/noderunner.js'), 
				'controllerCode' => str_replace( '<', '&lt;', file_get_contents(__FILE__) )
			], 
			'noderunner' );

		return $view->get();
	}

	/** 
	* runs node.js code
	* @param string $code the code to be run by webtask.io
	* @return json
	*/
	public function run_post(string $code) {
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