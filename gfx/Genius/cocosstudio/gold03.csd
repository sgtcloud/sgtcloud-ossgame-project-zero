<GameFile>
  <PropertyGroup Name="gold03" Type="Node" ID="dc51b573-ace8-4c91-b34b-5f613b3a11a2" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.4000">
        <Timeline ActionTag="813131945" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="3" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="813131945" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="gold/gold03/gold03_shine01.png" Plist="gold03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="gold/gold03/gold03_shine02.png" Plist="gold03.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="255" R="0" G="255" B="127" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="15" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="gold03" ActionTag="813131945" Tag="23" IconVisible="False" LeftMargin="-39.5000" RightMargin="-39.5000" TopMargin="-32.0000" BottomMargin="-32.0000" ctype="SpriteObjectData">
            <Size X="79.0000" Y="64.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="gold/gold03/gold03_shine01.png" Plist="gold03.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>