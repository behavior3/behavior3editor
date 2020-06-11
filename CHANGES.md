## TreeFloderStructure分支
- 修改节点控件为TreeControl，方便折叠，工程较大时方便归类和查找
- 目前没有合并到master
## 0.4.0
- subtree支持。
- 节点过滤。
- desktop支持工程序列号到标准json，读取工程文件改写path字段。

## Version 0.3.0 [NEXT]

- mod: services splitted into models and services.
- mod: new building system and dependence organization.
- mod: version and building date automatically inserted into code.
- mod: minor presentation changes on loading screen and dash home.
- mod: desktop version now uses electron (see #14).
- mod: desktop version working on windows and linux (see #14).
- fix: cut now remove all nodes, and consider connections too (see #9).
- fix: ctrl+z does not affect property inputs anymore (see #10).
- fix: preview not showing in the first drag on Firefox (see #16).


## Version 0.2.0 [Not released]

**editor**:

- add: editor import and export custom_node property (see #9/b3js).
- add: editor create custom nodes automatically when importing (see #9/b3js).
- add: interface is using AngularJS now.
- add: editor now support multiple trees, you can change it on tree panel.
- add: history manager (undo/redo feature) (#13).
- add: desktop version using nwjs.
- add: a settings panels (see #6).
- add: node categories can have different colors (see #4).
- add: alt-click to select subtree (see #10).
- add: optional vertical layout (see #5).
- add: editor now can hanble multiple projects (see #15).
- mod: new commands and shortcuts (see #16, #17, #10 and #13).
- mod: new repository.
- mod: new architecture, merging viewer and editor (see #1).
- mod: further updates to the architecture.
- mod: parameters are read-only now, so they cannot be edited (see #2).
- mod: all communication (editor->app) is done by events.
- fix: error when importing json without Display.
- rem: dependence on JQuery and other libraries is removed.


## Version 0.1.0 [Out 27, 2014]

- initial release.
