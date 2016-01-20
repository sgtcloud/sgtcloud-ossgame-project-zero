<GameFile>
  <PropertyGroup Name="chest01" Type="Node" ID="fd8e1570-1d38-42a7-82a6-91ba25f78d22" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="0.3333">
        <Timeline ActionTag="884914616" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_close01.png" Plist="chest01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_open01.png" Plist="chest01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_open02.png" Plist="chest01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_open03.png" Plist="chest01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="12" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_open04.png" Plist="chest01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_open05.png" Plist="chest01.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="255" R="0" G="128" B="128" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="3" EndIndex="15">
          <RenderColor A="255" R="70" G="130" B="180" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="17" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest" ActionTag="884914616" Tag="18" IconVisible="False" LeftMargin="-54.5000" RightMargin="-54.5000" TopMargin="-52.5000" BottomMargin="-52.5000" ctype="SpriteObjectData">
            <Size X="109.0000" Y="105.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest01/chest01_close01.png" Plist="chest01.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>