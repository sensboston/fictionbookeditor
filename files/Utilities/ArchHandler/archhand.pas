uses windows,shellapi;

var
  s: string;
  params: string;
  param2,param4:string;
  c : integer;

begin
  if (paramcount<5) then
  begin
    MessageBox(0,'ArchHandler needs at least five parameters to be passed.','ArchHandler Error.',MB_OK);
    halt;
  end;
  s:=paramstr(1);
  if (pos('.fb2.',s)>0) or (pos('.Fb2.',s)>0) or (pos('.fB2.',s)>0) or (pos('.FB2.',s)>0) then
  begin
    params:=paramstr(3);
    c:=pos('$1',params);
    while (c>0) do
    begin
      params := copy(params,1,c-1)+#34+paramstr(1)+#34+copy(params,c+2,length(params)-c-2);
      c:=pos('$1',params);
    end;
    params:=params+#0;
    param2:=paramstr(2)+#0;
    ShellExecute(0,'open',@param2[1],@params[1],@param2[1],sw_shownormal);
  end
  else begin
    params:=paramstr(5);
    c:=pos('$1',params);
    while (c>0) do
    begin
      params := copy(params,1,c-1)+#34+paramstr(1)+#34+copy(params,c+2,length(params)-c-2);
      c:=pos('$1',params);
    end;
    params:=params+#0;
    param4:=paramstr(4)+#0;
    ShellExecute(0,'open',@param4[1],@params[1],@param4[1],sw_shownormal);
  end;
end.