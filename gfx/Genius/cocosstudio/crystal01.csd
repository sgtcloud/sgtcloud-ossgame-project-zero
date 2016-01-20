<GameFile>
  <PropertyGroup Name="crystal01" Type="Node" ID="d8f77dd1-1349-41a1-816e-23f50dbfc1ad" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="-540143222" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="material/crystal/crystal_shine01.png" Plist="crystal01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="material/crystal/crystal_shine02.png" Plist="crystal01.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="150" R="189" G="183" B="107" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="5" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="crystal01" ActionTag="-540143222" Tag="6" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="30.0000" Y="30.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="material/crystal/crystal_shine01.png" Plist="crystal01.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>