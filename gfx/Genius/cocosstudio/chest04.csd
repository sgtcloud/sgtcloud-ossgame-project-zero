<GameFile>
  <PropertyGroup Name="chest04" Type="Node" ID="bb8de4a5-ab82-4324-b389-d0c5e4a05249" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="0.3333">
        <Timeline ActionTag="-1092918593" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_close01.png" Plist="chest04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_open01.png" Plist="chest04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_open02.png" Plist="chest04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_open03.png" Plist="chest04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="12" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_open04.png" Plist="chest04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_open05.png" Plist="chest04.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="255" R="255" G="222" B="173" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="3" EndIndex="15">
          <RenderColor A="255" R="240" G="128" B="128" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="25" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest" ActionTag="-1092918593" Tag="26" IconVisible="False" LeftMargin="-68.5000" RightMargin="-68.5000" TopMargin="-56.5000" BottomMargin="-56.5000" ctype="SpriteObjectData">
            <Size X="137.0000" Y="113.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest04/chest04_open04.png" Plist="chest04.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>