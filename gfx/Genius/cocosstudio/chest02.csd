<GameFile>
  <PropertyGroup Name="chest02" Type="Node" ID="4b84628b-ebf9-45c3-a5c6-d5662051a08e" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="0.3333">
        <Timeline ActionTag="-540660398" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_close01.png" Plist="chest02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_open01.png" Plist="chest02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_open02.png" Plist="chest02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_open03.png" Plist="chest02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="12" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_open04.png" Plist="chest02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_open05.png" Plist="chest02.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="150" R="255" G="140" B="0" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="3" EndIndex="15">
          <RenderColor A="150" R="255" G="69" B="0" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="19" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest" ActionTag="-540660398" Tag="20" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="112.0000" Y="105.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest02/chest02_close01.png" Plist="chest02.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>