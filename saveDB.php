<?php

	class CRUD {

		private $file;
		private $data;

		public function __construct() {
			$this->buildData();
			$this->save();
			echo json_encode(true);
		}

		public function buildData() {
			$this->file = "db/" . json_decode($_POST["db"], true)["file"];
			$this->data = json_decode($_POST["db"], true)["data"];
		}

		public function save() {
			$fileContent = $this->data;
			file_put_contents($this->file, $fileContent);
		}

	}

	new CRUD();

?>