import ControllerManager from 'editor/controller/controllermanager.js'
import ViewManager from 'editor/view/viewmanager.js'
import ModelManager from 'editor/model/modelmanager.js'
import Store from 'editor/store/store.js'
import EventManager from 'editor/event/eventmanager.js'
import HistoryManager from 'editor/history/historymanager.js'

import logger from 'editor/common/logging.js'


export default class Editor {
  constructor() {
    logger.info(`Initializing editor...`)

    this.events     = new EventManager(this)
    this.history    = new HistoryManager(this)
    this.store      = new Store()
    this.controller = new ControllerManager(this)
    this.view       = new ViewManager(this)
    this.model      = new ModelManager(this)
  }

  run(action, parameters) {
    this.controller.run(action, parameters)
  }
}
