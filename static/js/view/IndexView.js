define(['presenter/IndexPresenter', 'core/services/Log',
//'text!template.html',
'jquery'], function(presenter, Log) {
    var IndexView = ( function() {
            var TABLE = "#resume-index-table";
            /**
             * Constructor
             */
            function IndexView() {

                function loadResume() {
                    presenter.loadResume();
                }

                function onLoadResumeSuccess(data) {
                    Log.log(data);
                    for (var i = 0; i < data.resumes.length; i++) {
                        var resume = data.resumes[i];
                        var trStr = '<tr><td>' + resume["id"] + '</td><td>'+
                                    resume["name"] +'</td><td>'+ resume["age"] 
                                    +'</td><td>'+ (resume["sex"]==0?'男':'女')+'</td><td>'+
                                    resume["education"]+'</td><td>'+resume["major"]+'</td></tr>';
                        $(TABLE + ' tbody').append(trStr);
                    }
                }

                function onLoadResumeError(errorInfo) {
                    Log.log(errorInfor);
                    alert(errorInfo.message);
                }

                /**
                 * @public
                 */
                this.pause = function() {
                    //masterPaneView.pause();
                };

                this.resume = function() {
                    presenter.on("loadResumeSuccess", onLoadResumeSuccess);
                    presenter.on("loadResumeError", onLoadResumeError);
                };

                this.init = function() {
                    Log.log("Init in IndexView");
                    loadResume();
                    this.resume();
                };
            }

            return new IndexView();
        }());
    return IndexView;
});
