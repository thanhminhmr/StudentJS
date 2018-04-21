@extends('layouts.main')

@section('main.title') View Request @endsection

@section('main.style') @endsection

@section('main.script')
    <script>
        $(function () {
            $('#comment_content').wysihtml5();
        });
    </script>
@endsection

@section('main.content')
    <section class="content">
        <div class="box box-primary box-solid">
            <div class="box-header with-border">
                <h3 class="box-title">{{ $request->title }}</h3>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-sm-6 col-xs-12">
                                <strong>Created by:</strong>
                                <p>{{ $request->created_by_user->fullname }}
                                    <small>({{ '@' . $request->created_by_user->username }})</small>
                                </p>
                            </div>
                            <div class="col-sm-6 col-xs-12">
                                <strong>Created at:</strong>
                                <p>{{ $request->created_at }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-sm-6 col-xs-12">
                                <strong>Assigned to:</strong>
                                <p>{{ $request->assigned_to_user->fullname }}
                                    <small>({{ '@' . $request->assigned_to_user->username }})</small>
                                </p>
                            </div>
                            <div class="col-sm-6 col-xs-12">
                                <strong>Deadline at:</strong>
                                <p>{{ $request->deadline_at }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-sm-6 col-xs-12">
                                <strong>Department:</strong>
                                <p>{{ $request->department_name }}</p>
                            </div>
                            <div class="col-sm-6 col-xs-12">
                                <strong>Team:</strong>
                                @if($request->team_id == null)
                                    <p>-</p>
                                @else
                                    <p>{{ $request->team_name }}</p>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-sm-6 col-xs-12">
                                <strong>Priority:</strong>
                                <p>{{ $request->priority_name }}</p>
                            </div>
                            <div class="col-sm-6 col-xs-12">
                                <strong>Status:</strong>
                                <p>{{ $request->status_name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <strong>Relater(s):</strong>
                @if($request_relaters == null)
                    <p>-</p>
                @else
                    <p>
                        @foreach ($request->relaters as $relater)
                            <span class="text-nowrap">{{ $relater->fullname }}
                                <small>({{ '@' . $relater->username }})</small></span>{{ $loop->last ? '' : ', ' }}
                        @endforeach
                    </p>
                @endif
            </div>
            <div class="box-footer">
                {{ $request->content }}
            </div>
        </div>

        @foreach ($comments as $comment)
            <div class="box box-primary">
                <div class="box-header with-border" data-widget="collapse">
                    <h3 class="box-title">{{ $comment->fullname }}
                        <small>{{ '@' . $comment->username }}</small>
                    </h3>
                    <div class="box-tools pull-right">
                        <small><i class="fa fa-clock-o"></i> 2017-12-31 09:00</small>
                        <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i></button>
                    </div>
                </div>
                <div class="box-body">
                    <p>some comment content here</p>
                </div>
            </div>

        @endforeach
        <div class="box box-primary">
            <div class="box-header with-border" data-widget="collapse">
                <h3 class="box-title">Some One Name
                    <small>@someoneusername</small>
                </h3>
                <div class="box-tools pull-right">
                    <small><i class="fa fa-clock-o"></i> 2017-12-31 09:00</small>
                    <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i></button>
                </div>
            </div>
            <div class="box-body">
                <p>some comment content here</p>
            </div>
        </div>

        <div class="box box-primary">
            <div class="box-header with-border" data-widget="collapse">
                <h3 class="box-title">Some One Else Name
                    <small>@someoneelseusername</small>
                </h3>
                <div class="box-tools pull-right">
                    <small><i class="fa fa-clock-o"></i> 2017-12-31 09:00</small>
                    <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i></button>
                </div>
            </div>
            <div class="box-body">
                <p>another comment content here</p>
            </div>
        </div>

        <form method="post" action="{{ route('comment') }}">
            <div class="box box-primary box-solid">
                <div class="box-header with-border" data-widget="collapse">
                    <h3 class="box-title">Write comment:</h3>
                    <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i></button>
                    </div>
                </div>
                <div class="box-body">
                    <textarea id="comment_content" name="content" class="form-control" style="height:150px"></textarea>
                </div>
                <div class="box-footer">
                    <div class="pull-right">
                        <button type="submit" class="btn btn-primary">Comment</button>
                    </div>
                </div>
            </div>
        </form>
    </section>
@endsection
