<GameFile>
  <PropertyGroup Name="iron01" Type="Node" ID="be2ebc77-8833-4039-8fbb-294dd62be192" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="1422600497" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="material/iron/iron_shine01.png" Plist="iron01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="material/iron/iron_shine02.png" Plist="iron01.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="150" R="255" G="250" B="205" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="11" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="iron01" ActionTag="1422600497" Tag="12" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="30.0000" Y="30.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="material/iron/iron_shine02.png" Plist="iron01.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>