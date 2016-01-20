<GameFile>
  <PropertyGroup Name="bronze01" Type="Node" ID="9a03f160-5a4e-42dc-ae10-25e7cfb8a2b5" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="-388551529" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="material/bronze/bronze_shine01.png" Plist="bronze01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="material/bronze/bronze_shine02.png" Plist="bronze01.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="255" R="0" G="191" B="255" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="3" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="bronze01" ActionTag="-388551529" Tag="4" IconVisible="False" LeftMargin="-15.0000" RightMargin="-15.0000" TopMargin="-15.0000" BottomMargin="-15.0000" ctype="SpriteObjectData">
            <Size X="30.0000" Y="30.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="material/bronze/bronze_shine01.png" Plist="bronze01.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>