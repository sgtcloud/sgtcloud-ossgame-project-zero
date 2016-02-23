<GameFile>
  <PropertyGroup Name="blood02" Type="Node" ID="0aede082-04c2-496a-87de-105a1298c98f" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="2124357028" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="blood/blood02/middle_blood_shine01.png" Plist="blood02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="blood/blood02/middle_blood_shine02.png" Plist="blood02.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="150" R="0" G="206" B="209" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="10" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="blood" ActionTag="2124357028" Tag="11" IconVisible="False" LeftMargin="-15.0000" RightMargin="-15.0000" TopMargin="-15.0000" BottomMargin="-15.0000" ctype="SpriteObjectData">
            <Size X="30.0000" Y="30.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="blood/blood02/middle_blood_shine02.png" Plist="blood02.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>