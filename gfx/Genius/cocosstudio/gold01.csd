<GameFile>
  <PropertyGroup Name="gold01" Type="Node" ID="134148fb-f139-4a35-8a80-cf9f4c863454" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="1923175001" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="3" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="1923175001" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="gold/gold01/gold01_shine01.png" Plist="gold01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="gold/gold01/gold01_shine02.png" Plist="gold01.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="150" R="143" G="188" B="139" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="13" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="gold01" ActionTag="1923175001" Tag="19" IconVisible="False" LeftMargin="-22.5000" RightMargin="-22.5000" TopMargin="-20.5000" BottomMargin="-20.5000" ctype="SpriteObjectData">
            <Size X="45.0000" Y="41.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="0.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="gold/gold01/gold01_shine02.png" Plist="gold01.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>