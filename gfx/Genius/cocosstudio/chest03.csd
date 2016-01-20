<GameFile>
  <PropertyGroup Name="chest03" Type="Node" ID="6f408ed5-d18c-4a86-b711-e473b26e43bc" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="0.3333">
        <Timeline ActionTag="-2118852401" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_close01.png" Plist="chest03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_open01.png" Plist="chest03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_open02.png" Plist="chest03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_open03.png" Plist="chest03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="12" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_open04.png" Plist="chest03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_open05.png" Plist="chest03.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="150" R="248" G="248" B="255" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="3" EndIndex="15">
          <RenderColor A="150" R="255" G="255" B="224" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="23" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest" ActionTag="-2118852401" Tag="24" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="125.0000" Y="116.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest03/chest03_close01.png" Plist="chest03.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>