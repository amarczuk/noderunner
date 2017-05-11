<?php

namespace Phresto\Modules\Model;
use Phresto\MySQLModel;
use Phresto\Model;

class nodecode extends MySQLModel {
    const CLASSNAME = __CLASS__;

    const DB = 'mysql';
    const NAME = 'nodecode';
    const INDEX = 'id';
    const COLLECTION = 'nodecode';

    protected static $_fields = [ 'id' => 'int', 
                                  'code' => 'string'
                                ];
}